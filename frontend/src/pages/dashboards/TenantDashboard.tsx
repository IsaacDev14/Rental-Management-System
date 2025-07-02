// frontend/src/pages/dashboards/TenantDashboard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, AlertTriangle, User, Mail, Phone, Receipt, ClipboardList, MessageSquare, MapPin } from 'lucide-react'; // Import icons
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import { useData } from '../../hooks/useData'; // Import useData hook
import Modal from '../../components/ui/Modal'; // Import Modal component
import ImageCarousel from '../../components/common/ImageCarousel'; // Import ImageCarousel component
import { getLeaseStatus } from '../../utils/helpers'; // Import helper functions (removed getUnsplashImageUrl as it's not used directly here)
import type { Payment, Tenant, Property, Unit } from '../../types/models'; // Import Payment, Tenant, Property, Unit types as type-only

/**
 * TenantDashboard component.
 * Serves as the main dashboard for tenants, displaying their lease details,
 * payment history, and available properties.
 */
const TenantDashboard: React.FC = () => {
  // Correctly use the custom hooks to get context values
  const { data } = useData();
  const { currentUserId, login } = useAuth();

  // Initialize selectedTenantId based on currentUserId or the first dummy tenant
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(currentUserId || (data.tenants.length > 0 ? data.tenants[0].id : null));
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);

  // Sync selectedTenantId with currentUserId when it changes (e.g., after login)
  useEffect(() => {
    if (currentUserId) {
      setSelectedTenantId(currentUserId);
    }
  }, [currentUserId]);

  // Get the currently selected tenant's data
  const currentTenant = useMemo(() => {
    return data.tenants.find((t: Tenant) => t.id === selectedTenantId);
  }, [selectedTenantId, data.tenants]);

  // Get property and unit details for the current tenant
  const myProperty = useMemo(() => {
    return data.properties.find((p: Property) => p.id === currentTenant?.propertyId);
  }, [currentTenant, data.properties]);

  const myUnit = useMemo(() => {
    return myProperty?.units.find((u: Unit) => u.id === currentTenant?.unitId);
  }, [currentTenant, myProperty]);

  // Filter payments for the current tenant
  const myPayments = useMemo(() => {
    return data.payments.filter((p: Payment) => p.tenantId === currentTenant?.id);
  }, [currentTenant, data.payments]);

  // Prepare data for available properties to explore
  const availableProperties = useMemo(() => {
    return data.properties.map((prop: Property) => {
      const vacantUnits = prop.units.filter((unit: Unit) => !unit.tenantId);
      const occupiedUnits = prop.units.filter((unit: Unit) => unit.tenantId);
      return {
        ...prop,
        vacantUnits,
        occupiedUnits,
      };
    });
  }, [data.properties]);

  /**
   * Handles viewing a payment receipt in a modal.
   * @param payment The payment object to display the receipt for.
   */
  const handleViewReceipt = (payment: Payment) => {
    setSelectedPaymentForReceipt(payment);
    setShowReceiptModal(true);
  };

  /**
   * Calculates the lease progress percentage.
   */
  const leaseProgress = useMemo(() => {
    if (!currentTenant?.leaseStart || !currentTenant?.leaseEnd) return 0;
    const start = new Date(currentTenant.leaseStart).getTime();
    const end = new Date(currentTenant.leaseEnd).getTime();
    const now = new Date().getTime();
    if (now < start) return 0; // Lease hasn't started
    if (now > end) return 100; // Lease has ended
    return ((now - start) / (end - start)) * 100;
  }, [currentTenant]);

  // Display a message if no tenant is selected or found (e.g., first login)
  if (!currentTenant) {
    return (
      <div className="p-8 flex-1 overflow-y-auto bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-700">
          <AlertTriangle size={64} className="text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white">No Tenant Selected or Found</h3>
          <p className="text-gray-400 mt-2 mb-4">Please log in as a tenant or ensure a tenant ID is set.</p>
          {/* Only show button if there are dummy tenants to log in with */}
          {data.tenants.length > 0 && (
            <button onClick={() => login('tenant', data.tenants[0].id)} className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200">
              Login as first dummy tenant
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Payment Receipt Modal */}
      <Modal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} title="Payment Receipt">
        {selectedPaymentForReceipt && (
          <div className="p-4 bg-gray-700 rounded-lg text-white">
            <h4 className="text-xl font-bold text-center mb-6">OFFICIAL RECEIPT</h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div><p className="text-gray-400">Receipt No:</p><p className="font-semibold">{selectedPaymentForReceipt.id}</p></div>
              <div><p className="text-gray-400">Date:</p><p className="font-semibold">{selectedPaymentForReceipt.date}</p></div>
              <div><p className="text-gray-400">Tenant:</p><p className="font-semibold">{currentTenant.name}</p></div>
              <div><p className="text-gray-400">Property:</p><p className="font-semibold">{myProperty?.name || 'N/A'}</p></div>
              <div><p className="text-gray-400">Unit:</p><p className="font-semibold">{myUnit?.name || 'N/A'}</p></div>
              <div><p className="text-gray-400">Payment Method:</p><p className="font-semibold">{selectedPaymentForReceipt.method}</p></div>
            </div>
            <div className="text-center bg-gray-600 p-4 rounded-lg">
              <p className="text-gray-400 text-lg">Amount Paid:</p>
              <p className="text-4xl font-extrabold text-emerald-400">KES {selectedPaymentForReceipt.amount.toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-500 text-center mt-6">Thank you for your payment!</p>
          </div>
        )}
      </Modal>

      <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
        {/* Welcome and Tenant Selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold mb-1">Welcome, {currentTenant.name}!</h2>
            <p className="text-gray-400 text-lg">Here is a summary of your tenancy and available properties.</p>
          </div>
          <div className="w-full md:w-64 flex-shrink-0 relative">
            <label htmlFor="tenant-select" className="text-sm font-medium text-gray-300 mb-2 block">View as Tenant:</label>
            <select
              id="tenant-select"
              value={selectedTenantId || ''}
              onChange={e => setSelectedTenantId(e.target.value)}
              className="block w-full pl-4 pr-10 py-3 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200"
            >
              {data.tenants.map((t: Tenant) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-[calc(1.5rem+10px)] -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>
        
        {/* My Profile Card */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">My Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <p className="flex items-center"><User size={16} className="mr-2 text-cyan-400" /> <span className="font-semibold text-white">Name:</span> {currentTenant.name}</p>
            <p className="flex items-center"><Mail size={16} className="mr-2 text-cyan-400" /> <span className="font-semibold text-white">Email:</span> {currentTenant.email}</p>
            <p className="flex items-center"><Phone size={16} className="mr-2 text-cyan-400" /> <span className="font-semibold text-white">Phone:</span> {currentTenant.phone}</p>
          </div>
        </div>

        {/* Lease Details and Payment History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* My Lease Details */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">My Lease Details</h3>
            <p className="mb-3 text-gray-300"><strong className="text-white">Property:</strong> {myProperty?.name || 'N/A'}</p>
            <p className="mb-3 text-gray-300"><strong className="text-white">Unit:</strong> {myUnit?.name || 'N/A'} ({myUnit?.type || 'N/A'})</p>
            <p className="mb-3 text-gray-300"><strong className="text-white">Monthly Rent:</strong> <span className="font-semibold text-emerald-400">KES {myUnit?.rent.toLocaleString() || 'N/A'}</span></p>
            <p className="mb-3 text-gray-300"><strong className="text-white">Lease Ends:</strong> {currentTenant.leaseEnd || 'N/A'}</p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Lease Progress:</h4>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${leaseProgress}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{leaseProgress.toFixed(1)}% complete</p>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">Payment History</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {myPayments.length > 0 ? myPayments.map((p: Payment) => ( // Explicitly type p
                <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                  <span className="text-sm text-gray-300">{p.date}</span>
                  <span className="font-semibold text-white">KES {p.amount.toLocaleString()}</span>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${p.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {getLeaseStatus(currentTenant.leaseEnd) === 'Expired' && p.status !== 'Paid' ? 'Overdue' : p.status}
                  </span>
                  {p.status === 'Paid' && (
                    <button onClick={() => handleViewReceipt(p)} className="text-blue-400 hover:text-blue-300 p-1 rounded-full hover:bg-gray-600 transition-colors duration-200" title="View Receipt">
                      <Receipt size={18} />
                    </button>
                  )}
                </div>
              )) : <p className="text-gray-400 text-sm">No payment history available.</p>}
            </div>
            <button className="mt-6 w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold py-3 px-5 rounded-lg shadow-md transition-all duration-200">
              Make a Payment (M-PESA)
            </button>
          </div>
        </div>

        {/* Maintenance Request & Contact Landlord */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Maintenance & Support</h3>
          <p className="text-gray-300 mb-4">Need something fixed? Submit a maintenance request here.</p>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200">
              <ClipboardList className="mr-2" /> Submit Maintenance Request
            </button>
            <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200">
              <MessageSquare className="mr-2" /> Contact Landlord
            </button>
          </div>
        </div>

        {/* Available Units & Properties Section */}
        <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-6 text-white">Explore Available Properties & Units</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProperties.map((prop: Property) => ( // Explicitly type prop
              <div key={prop.id} className="bg-gray-700 rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-600 transition-all duration-300 hover:shadow-lg hover:border-cyan-500/50">
                {/* Property Images Carousel */}
                <ImageCarousel images={prop.images} />
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-bold text-xl text-cyan-400 mb-1">{prop.name}</h4>
                  <p className="text-sm text-gray-300 flex items-center mb-3"><MapPin size={16} className="mr-2 text-gray-400" />{prop.location}</p>
                  
                  {/* Static Map Image */}
                  {prop.coordinates && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-gray-600">
                          <img
                              src={`https://maps.googleapis.com/maps/api/staticmap?center=${prop.coordinates.lat},${prop.coordinates.lng}&zoom=14&size=400x200&markers=color:blue%7Clabel:P%7C${prop.coordinates.lat},${prop.coordinates.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`} // Placeholder for actual API key
                              alt={`Map of ${prop.location}`}
                              className="w-full h-auto object-cover"
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://placehold.co/400x200/374151/FFFFFF?text=Map+Error"; }}
                          />
                          <p className="text-xs text-gray-400 text-center py-1 bg-gray-600">Map view (requires API Key)</p>
                      </div>
                  )}

                  <div className="mt-2 flex-1">
                    <h5 className="text-md font-semibold text-gray-200 mb-2">Units:</h5>
                    <div className="space-y-2">
                      {prop.units.map((unit: Unit) => ( // Explicitly type unit
                        <div key={unit.id} className="flex justify-between items-center text-sm bg-gray-600 p-3 rounded-lg border border-gray-500">
                          <span className="font-medium text-white">{unit.name} ({unit.type})</span>
                          {unit.tenantId ? (
                            <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400 font-semibold">Occupied</span>
                          ) : (
                            <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">Vacant</span>
                          )}
                          {!unit.tenantId && (
                            <button className="text-cyan-400 hover:text-cyan-300 text-xs ml-2 py-1 px-2 rounded-md hover:bg-gray-500 transition-colors duration-200">Express Interest</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {availableProperties.length === 0 && (
              <p className="text-gray-400 col-span-full text-center text-lg py-8">No properties available to explore at this time.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TenantDashboard;
