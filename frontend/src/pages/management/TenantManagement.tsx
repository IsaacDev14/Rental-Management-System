import React, { useState, useMemo, useEffect } from 'react';
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  Mail,
  Phone,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/ui/Modal';
import InputField from '../../components/ui/InputField';
import SelectField from '../../components/ui/SelectField';
import Button from '../../components/ui/Button';
import DataTable from '../../components/tables/DataTable';
import type { Tenant, Property } from '../../types/models';
import { getLeaseStatus } from '../../utils/helpers';

/**
 * TenantManagement component.
 * Allows landlords to add, view, edit, and delete tenant records.
 * Includes search and filter functionalities for tenants.
 */
const TenantManagement: React.FC = () => {
  const { data, setData, logAction, sendNotification } = useData();
  const { currentUserId } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Ending Soon' | 'Expired'>('All');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null); // Used to show tenant detail modal

  // Properties belonging to current landlord
  const landlordProperties = useMemo(() => {
    return data.properties.filter(p => p.landlordId === currentUserId);
  }, [data.properties, currentUserId]);

  // Tenants belonging to landlord's properties
  const landlordTenants = useMemo(() => {
    const propIds = landlordProperties.map(p => p.id);
    return data.tenants.filter(t => propIds.includes(t.propertyId));
  }, [data.tenants, landlordProperties]);

  // Filter tenants by search and lease status
  const filteredTenants = useMemo(() => {
    let tenants = landlordTenants;

    if (searchTerm) {
      tenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone.includes(searchTerm)
      );
    }

    if (filterStatus !== 'All') {
      tenants = tenants.filter(t => getLeaseStatus(t.leaseEnd) === filterStatus);
    }

    return tenants;
  }, [landlordTenants, searchTerm, filterStatus]);

  // Open modal for adding new tenant
  const handleAddTenantClick = () => {
    setEditingTenant(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing tenant
  const handleEditTenantClick = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  // Save new or updated tenant
  const handleSaveTenant = (tenantData: Tenant) => {
    setData(prev => {
      let updatedTenants = [...prev.tenants];
      const updatedProperties = [...prev.properties];

      if (editingTenant) {
        // Unassign tenant from old unit if unit changed
        const oldProperty = prev.properties.find(p => p.id === editingTenant.propertyId);
        const oldUnit = oldProperty?.units.find(u => u.id === editingTenant.unitId);
        if (oldUnit && oldUnit.tenantId === editingTenant.id && oldUnit.id !== tenantData.unitId) {
          oldUnit.tenantId = null;
        }

        // Update tenant record
        updatedTenants = updatedTenants.map(t => t.id === tenantData.id ? tenantData : t);
        logAction(`Updated tenant: ${tenantData.name}`);
      } else {
        // Add new tenant
        updatedTenants.push(tenantData);
        logAction(`Added new tenant: ${tenantData.name}`);
        sendNotification(`New tenant "${tenantData.name}" added.`);
      }

      // Assign tenant to new unit
      const newProperty = updatedProperties.find(p => p.id === tenantData.propertyId);
      const newUnit = newProperty?.units.find(u => u.id === tenantData.unitId);
      if (newUnit) {
        newUnit.tenantId = tenantData.id;
      }

      // Update properties with modified units
      return {
        ...prev,
        tenants: updatedTenants,
        properties: updatedProperties.map(p => ({
          ...p,
          units: p.id === newProperty?.id ? newProperty.units : p.units
        }))
      };
    });

    setIsModalOpen(false);
    setEditingTenant(null);
  };

  // Prepare deletion of tenant
  const handleDeleteTenantClick = (tenant: Tenant) => {
    setTenantToDelete(tenant);
    setIsDeleteConfirmOpen(true);
  };

  // Delete tenant and unassign from unit
  const performDeleteTenant = () => {
    if (tenantToDelete) {
      setData(prev => {
        const propertyOfTenant = prev.properties.find(p => p.id === tenantToDelete.propertyId);
        const unitOfTenant = propertyOfTenant?.units.find(u => u.id === tenantToDelete.unitId);
        if (unitOfTenant) {
          unitOfTenant.tenantId = null;
        }

        logAction(`Deleted tenant: ${tenantToDelete.name}`);
        sendNotification(`Tenant "${tenantToDelete.name}" has been removed.`);

        return {
          ...prev,
          tenants: prev.tenants.filter(t => t.id !== tenantToDelete.id),
          properties: prev.properties.map(p => ({
            ...p,
            units: p.id === propertyOfTenant?.id ? propertyOfTenant.units : p.units
          }))
        };
      });
      setIsDeleteConfirmOpen(false);
      setTenantToDelete(null);
    }
  };

  // Tenant form component (nested for simplicity)
  const TenantForm: React.FC<{ tenant: Tenant | null; onSave: (data: Tenant) => void; onCancel: () => void; properties: Property[] }> = ({ tenant, onSave, onCancel, properties }) => {
    const [formData, setFormData] = useState<Tenant>(() => tenant || {
      id: `t${Date.now()}`,
      name: '',
      email: '',
      phone: '',
      leaseStart: '',
      leaseEnd: '',
      propertyId: '',
      unitId: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    useEffect(() => {
      if (tenant) {
        setFormData(tenant);
      } else {
        setFormData({
          id: `t${Date.now()}`,
          name: '',
          email: '',
          phone: '',
          leaseStart: '',
          leaseEnd: '',
          propertyId: '',
          unitId: '',
        });
      }
      setErrors({});
    }, [tenant]);

    const availableUnits = useMemo(() => {
      const selectedProp = properties.find(p => p.id === formData.propertyId);
      if (!selectedProp) return [];
      return selectedProp.units.filter(unit =>
        !unit.tenantId || (tenant && unit.tenantId === tenant.id)
      );
    }, [formData.propertyId, properties, tenant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value } as Tenant));
      setErrors(prev => ({ ...prev, [id]: undefined }));
    };

    const validate = (): { [key: string]: string | undefined } => {
      const newErrors: { [key: string]: string | undefined } = {};
      if (!formData.name) newErrors.name = 'Tenant name is required.';
      if (!formData.email) newErrors.email = 'Email is required.';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
      if (!formData.phone) newErrors.phone = 'Phone number is required.';
      if (!formData.leaseStart) newErrors.leaseStart = 'Lease start date is required.';
      if (!formData.leaseEnd) newErrors.leaseEnd = 'Lease end date is required.';
      if (formData.leaseStart && formData.leaseEnd && new Date(formData.leaseStart) >= new Date(formData.leaseEnd)) {
        newErrors.leaseEnd = 'Lease end date must be after start date.';
      }
      if (!formData.propertyId) newErrors.propertyId = 'Property is required.';
      if (!formData.unitId) newErrors.unitId = 'Unit is required.';
      return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        onSave(formData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField id="name" type="text" label="Tenant Name" value={formData.name} onChange={handleChange} error={errors.name} required />
        <InputField id="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} error={errors.email} required />
        <InputField id="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange} error={errors.phone} required />
        <InputField id="leaseStart" type="date" label="Lease Start Date" value={formData.leaseStart} onChange={handleChange} error={errors.leaseStart} required />
        <InputField id="leaseEnd" type="date" label="Lease End Date" value={formData.leaseEnd} onChange={handleChange} error={errors.leaseEnd} required />
        <SelectField
          id="propertyId"
          label="Property"
          value={formData.propertyId}
          onChange={(e) => {
            handleChange(e);
            setFormData(prev => ({ ...prev, unitId: '' }));
          }}
          error={errors.propertyId}
          options={properties.map(p => ({ value: p.id, label: p.name }))}
          required
        />
        <SelectField
          id="unitId"
          label="Unit"
          value={formData.unitId}
          onChange={handleChange}
          error={errors.unitId}
          options={availableUnits.map(u => ({ value: u.id, label: `${u.name} (${u.type}) - KES ${u.rent.toLocaleString()}` }))}
          disabled={!formData.propertyId || availableUnits.length === 0}
          required
          placeholder={!formData.propertyId ? "Select a property first" : (availableUnits.length === 0 ? "No vacant units available" : "Select Unit")}
        />
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">{tenant ? "Update Tenant" : "Add Tenant"}</Button>
        </div>
      </form>
    );
  };

  // Delete confirmation modal
  const DeleteConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; itemType: string; itemName: string | undefined }> = ({ isOpen, onClose, onConfirm, itemType, itemName }) => {
    if (!isOpen) return null;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Confirm Delete ${itemType}`}>
        <div className="p-4 text-center">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
          <p className="text-lg text-white mb-8">
            Are you sure you want to delete {itemType} <span className="font-bold text-red-400">"{itemName}"</span>? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm}>Delete</Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Tenant Detail Modal to fix unused selectedTenant warning
  const TenantDetailModal: React.FC<{ tenant: Tenant | null; onClose: () => void }> = ({ tenant, onClose }) => {
    if (!tenant) return null;

    const property = data.properties.find(p => p.id === tenant.propertyId);
    const unit = property?.units.find(u => u.id === tenant.unitId);
    const leaseStatus = getLeaseStatus(tenant.leaseEnd);

    return (
      <Modal isOpen={!!tenant} onClose={onClose} title="Tenant Details">
        <div className="space-y-4 text-white">
          <p><strong>Name:</strong> {tenant.name}</p>
          <p><strong>Email:</strong> {tenant.email}</p>
          <p><strong>Phone:</strong> {tenant.phone}</p>
          <p><strong>Property:</strong> {property?.name || 'N/A'}</p>
          <p><strong>Unit:</strong> {unit?.name || 'N/A'}</p>
          <p><strong>Lease Start:</strong> {tenant.leaseStart}</p>
          <p><strong>Lease End:</strong> {tenant.leaseEnd}</p>
          <p><strong>Status:</strong> {leaseStatus}</p>
          <div className="flex justify-end">
            <Button onClick={onClose} variant="secondary">
              Close <X className="inline ml-1" size={16} />
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Columns for tenants DataTable
  const tenantTableColumns = useMemo(() => [
    { key: 'name', header: 'Name', className: 'font-semibold text-white' },
    {
      key: 'propertyUnit',
      header: 'Property & Unit',
      render: (row: Tenant) => {
        const prop = data.properties.find(p => p.id === row.propertyId);
        const unit = prop?.units.find(u => u.id === row.unitId);
        return `${prop?.name || 'N/A'} - ${unit?.name || 'N/A'}`;
      },
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (row: Tenant) => (
        <div className="flex flex-col space-y-1">
          <span className="flex items-center text-gray-300"><Mail size={14} className="mr-2 text-gray-500" />{row.email}</span>
          <span className="flex items-center text-gray-300"><Phone size={14} className="mr-2 text-gray-500" />{row.phone}</span>
        </div>
      ),
    },
    { key: 'leaseEnd', header: 'Lease End' },
    {
      key: 'status',
      header: 'Status',
      render: (row: Tenant) => {
        const leaseStatus = getLeaseStatus(row.leaseEnd);
        const statusColorClass = {
          'Active': 'bg-emerald-500/20 text-emerald-400',
          'Ending Soon': 'bg-amber-500/20 text-amber-400',
          'Expired': 'bg-red-500/20 text-red-400',
          'N/A': 'bg-gray-500/20 text-gray-400'
        }[leaseStatus] || 'bg-gray-500/20 text-gray-400';
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColorClass}`}>
            {leaseStatus}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Tenant) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditTenantClick(row)} title="Edit Tenant">
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteTenantClick(row)} title="Delete Tenant">
            <Trash2 size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelectedTenant(row)} title="View Details">
            <Info size={18} />
          </Button>
        </div>
      ),
    },
  ], [data.properties]);

  return (
    <>
      {/* Tenant Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTenant ? "Edit Tenant" : "Add New Tenant"}>
        <TenantForm
          tenant={editingTenant}
          onSave={handleSaveTenant}
          onCancel={() => setIsModalOpen(false)}
          properties={landlordProperties}
        />
      </Modal>

      {/* Tenant Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={performDeleteTenant}
        itemType="Tenant"
        itemName={tenantToDelete?.name}
      />

      {/* Tenant Detail Modal */}
      <TenantDetailModal tenant={selectedTenant} onClose={() => setSelectedTenant(null)} />

      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h3 className="text-xl font-semibold">My Tenants</h3>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tenants..."
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
                <option value="Active">Active</option>
                <option value="Ending Soon">Ending Soon</option>
                <option value="Expired">Expired</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {/* Add Tenant Button */}
            <Button onClick={handleAddTenantClick} className="w-full sm:w-auto">
              <PlusCircle className="mr-2" /> Add Tenant
            </Button>
          </div>
        </div>
        {/* Tenants Data Table */}
        <DataTable<Tenant>
          data={filteredTenants}
          columns={tenantTableColumns}
          emptyMessage="No tenants found matching your criteria."
        />
      </div>
    </>
  );
};

export default TenantManagement;
