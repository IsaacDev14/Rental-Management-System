// frontend/src/pages/management/RentalDepositInvestment.tsx

import React, { useState, useMemo, useContext } from 'react';
import { Shield, TrendingUp, Briefcase, Wallet, AlertTriangle, Search, ChevronDown } from 'lucide-react'; // Import icons
import { useData } from '../../hooks/useData'; // Import useData hook
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import StatCard from '../../components/common/StatCard'; // Import StatCard component
import Button from '../../components/ui/Button'; // Import Button component
import DataTable from '../../components/tables/DataTable'; // Import DataTable component
import Modal from '../../components/ui/Modal'; // Import Modal component
import { Deposit, Tenant, Property } from '../../types/models'; // Import Deposit, Tenant, Property types

/**
 * RentalDepositInvestment component.
 * Allows landlords to manage rental deposits and view simulated investment returns.
 * Includes search and filter functionalities for deposits.
 */
const RentalDepositInvestment: React.FC = () => {
  const { data, setData, logAction, sendNotification } = useData();
  const { currentUserId, userRole } = useAuth(); // Get current user ID and role
  const isLandlord = userRole === 'landlord';

  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [depositToRefund, setDepositToRefund] = useState<Deposit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Held' | 'Refunded' | 'Partially Refunded'>('All');

  // Filter properties to show only those belonging to the current landlord
  const landlordProperties = useMemo(() => {
    return data.properties.filter(p => p.landlordId === currentUserId);
  }, [data.properties, currentUserId]);

  // Filter deposits to show only those belonging to the current landlord
  const landlordDeposits = useMemo(() => {
    if (!isLandlord || !currentUserId) return [];
    return data.deposits.filter(d => d.landlordId === currentUserId);
  }, [data.deposits, currentUserId, isLandlord]);

  // Filtered deposits based on search term and status
  const filteredDeposits = useMemo(() => {
    let deposits = landlordDeposits;

    if (searchTerm) {
      deposits = deposits.filter(d => {
        const tenant = data.tenants.find(t => t.id === d.tenantId);
        const property = data.properties.find(p => p.id === d.propertyId);
        return (
          (tenant?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (property?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (filterStatus !== 'All') {
      deposits = deposits.filter(d => d.status === filterStatus);
    }

    return deposits;
  }, [landlordDeposits, searchTerm, filterStatus, data.tenants, data.properties]);


  // Calculate key metrics for deposits
  const totalDepositsHeld = landlordDeposits.filter(d => d.status === 'Held').reduce((sum, d) => sum + d.amount, 0);
  const simulatedInterestRate = data.investmentFunds.find(f => f.id === 'mmf1')?.currentRate || 0.08; // Using MMF for simulation
  const simulatedMonthlyInterest = (totalDepositsHeld * simulatedInterestRate) / 12;

  /**
   * Handles initiating a deposit refund.
   * @param deposit The deposit object to refund.
   */
  const handleRefundDepositClick = (deposit: Deposit) => {
    setDepositToRefund(deposit);
    setIsRefundModalOpen(true);
  };

  /**
   * Performs the actual refund of a deposit.
   * Updates the deposit status to 'Refunded' and logs the action.
   */
  const performRefundDeposit = () => {
    if (depositToRefund) {
      setData(prev => {
        const updatedDeposits = prev.deposits.map(d =>
          d.id === depositToRefund.id ? { ...d, status: 'Refunded' } : d
        );
        logAction(`Processed refund of KES ${depositToRefund.amount.toLocaleString()} for tenant ${data.tenants.find(t => t.id === depositToRefund.tenantId)?.name}.`);
        sendNotification(`Deposit refund of KES ${depositToRefund.amount.toLocaleString()} processed for ${data.tenants.find(t => t.id === depositToRefund.tenantId)?.name}.`);
        return { ...prev, deposits: updatedDeposits };
      });
      setIsRefundModalOpen(false);
      setDepositToRefund(null);
    }
  };

  /**
   * RefundConfirmationModal component (nested for simplicity).
   * Generic modal for confirming refund actions.
   */
  const RefundConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; deposit: Deposit | null }> = ({ isOpen, onClose, onConfirm, deposit }) => {
    if (!isOpen || !deposit) return null;
    const tenantName = data.tenants.find(t => t.id === deposit.tenantId)?.name || 'N/A';
    const propertyName = data.properties.find(p => p.id === deposit.propertyId)?.name || 'N/A';

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deposit Refund">
        <div className="p-4 text-center">
          <AlertTriangle size={64} className="text-amber-500 mx-auto mb-6" />
          <p className="text-lg text-white mb-8">
            Are you sure you want to process a refund of <span className="font-bold text-emerald-400">KES {deposit.amount.toLocaleString()}</span> for tenant <span className="font-bold text-cyan-400">"{tenantName}"</span> (Property: {propertyName})?
            This action will mark the deposit as 'Refunded'.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={onConfirm}>Confirm Refund</Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Define columns for the DataTable
  const depositTableColumns = useMemo(() => [
    {
      key: 'tenantName',
      header: 'Tenant',
      render: (row: Deposit) => {
        const tenant = data.tenants.find(t => t.id === row.tenantId);
        return tenant?.name || 'N/A';
      },
    },
    {
      key: 'property',
      header: 'Property',
      render: (row: Deposit) => {
        const property = data.properties.find(p => p.id === row.propertyId);
        return property?.name || 'N/A';
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: Deposit) => `KES ${row.amount.toLocaleString()}`,
    },
    { key: 'date', header: 'Date Received' },
    {
      key: 'status',
      header: 'Status',
      render: (row: Deposit) => (
        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${row.status === 'Held' ? 'bg-blue-500/20 text-blue-400' : row.status === 'Refunded' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Deposit) => (
        <div className="flex space-x-2">
          {row.status === 'Held' && (
            <Button variant="ghost" size="sm" onClick={() => handleRefundDepositClick(row)} title="Process Refund">
              <Wallet size={18} />
            </Button>
          )}
        </div>
      ),
    },
  ], [data.tenants, data.properties]); // Re-memoize if tenants or properties change

  return (
    <>
      {/* Refund Confirmation Modal */}
      <RefundConfirmationModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onConfirm={performRefundDeposit}
        deposit={depositToRefund}
      />

      <div className="space-y-8">
        {/* Key Statistics Cards for Deposits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Deposits Held" value={`KES ${totalDepositsHeld.toLocaleString()}`} icon={Shield} color="cyan" />
          <StatCard title="Simulated Monthly Interest" value={`KES ${simulatedMonthlyInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={TrendingUp} color="emerald" />
          <StatCard title="Investment Fund" value={data.investmentFunds.find(f => f.id === 'mmf1')?.name || 'N/A'} icon={Briefcase} color="teal" />
        </div>

        {/* Deposit Ledger Table */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <h3 className="text-xl font-semibold">Deposit Ledger {isLandlord && `for ${data.landlords.find(l => l.id === currentUserId)?.name || 'N/A'}`}</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              {/* Search Input */}
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search deposits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all duration-200"
                />
              </div>
              {/* Filter by Status */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  className="block w-full pl-3 pr-10 py-2.5 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Held">Held</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Partially Refunded">Partially Refunded</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
          <DataTable<Deposit>
            data={filteredDeposits}
            columns={depositTableColumns}
            emptyMessage="No deposits found matching your criteria."
          />
          {isLandlord && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h4 className="text-lg font-semibold mb-3">Investment Options & Rules</h4>
              <p className="text-sm text-gray-300 mb-2">Current Investment Fund: <span className="font-semibold text-cyan-400">{data.investmentFunds.find(f => f.id === 'mmf1')?.name}</span> (Rate: {simulatedInterestRate * 100}% p.a. - simulated)</p>
              <p className="text-sm text-gray-300 mb-2">Landlords can opt into interest-earning deposits. Funds are pooled and invested in low-risk Money Market Funds. Interest is calculated monthly and allocated to your portfolio.</p>
              <Button variant="secondary" size="sm" className="mt-3">Configure Investment Rules</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RentalDepositInvestment;
