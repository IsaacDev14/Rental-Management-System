import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Receipt, AlertTriangle, Search, ChevronDown } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/ui/Modal';
import InputField from '../../components/ui/InputField';
import SelectField from '../../components/ui/SelectField';
import Button from '../../components/ui/Button';
import DataTable from '../../components/tables/DataTable';
import type { Payment, Tenant, Property } from '../../types/models';

const PaymentManagement: React.FC = () => {
  const { data, setData, logAction, sendNotification } = useData();
  const { currentUserId } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Overdue' | 'Pending'>('All');

  const landlordProperties = useMemo(() => {
    return data.properties.filter(p => p.landlordId === currentUserId);
  }, [data.properties, currentUserId]);

  const landlordTenants = useMemo(() => {
    const propIds = landlordProperties.map(p => p.id);
    return data.tenants.filter(t => propIds.includes(t.propertyId));
  }, [data.tenants, landlordProperties]);

  const landlordPayments = useMemo(() => {
    const tenantIds = landlordTenants.map(t => t.id);
    return data.payments.filter(p => tenantIds.includes(p.tenantId));
  }, [data.payments, landlordTenants]);

  const filteredPayments = useMemo(() => {
    let payments = landlordPayments;
    if (searchTerm) {
      payments = payments.filter(p => {
        const tenant = data.tenants.find(t => t.id === p.tenantId);
        return (
          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tenant?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.method.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    if (filterStatus !== 'All') {
      payments = payments.filter(p => p.status === filterStatus);
    }
    return payments;
  }, [landlordPayments, searchTerm, filterStatus, data.tenants]);

  const handleRecordPaymentClick = () => {
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  const handleEditPaymentClick = (payment: Payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  const handleSavePayment = (paymentData: Payment) => {
    setData(prev => {
      let updatedPayments = [...prev.payments];
      const tenant = prev.tenants.find(t => t.id === paymentData.tenantId);

      if (editingPayment) {
        updatedPayments = updatedPayments.map(p => p.id === paymentData.id ? paymentData : p);
        logAction(`Updated payment for tenant ${tenant?.name || 'N/A'} - KES ${paymentData.amount.toLocaleString()}`);
      } else {
        updatedPayments.push(paymentData);
        logAction(`Recorded new payment for tenant ${tenant?.name || 'N/A'} - KES ${paymentData.amount.toLocaleString()}`);
        sendNotification(`Payment of KES ${paymentData.amount.toLocaleString()} received from ${tenant?.name || 'an unknown tenant'}.`);
      }

      return { ...prev, payments: updatedPayments };
    });
    setIsModalOpen(false);
    setEditingPayment(null);
  };

  const handleDeletePaymentClick = (payment: Payment) => {
    setPaymentToDelete(payment);
    setIsDeleteConfirmOpen(true);
  };

  const performDeletePayment = () => {
    if (paymentToDelete) {
      setData(prev => {
        const tenant = prev.tenants.find(t => t.id === paymentToDelete.tenantId);
        logAction(`Deleted payment for tenant ${tenant?.name || 'N/A'} - KES ${paymentToDelete.amount.toLocaleString()}`);
        sendNotification(`Payment of KES ${paymentToDelete.amount.toLocaleString()} for ${tenant?.name || 'an unknown tenant'} was deleted.`);
        return { ...prev, payments: prev.payments.filter(p => p.id !== paymentToDelete.id) };
      });
      setIsDeleteConfirmOpen(false);
      setPaymentToDelete(null);
    }
  };

  const PaymentForm: React.FC<{
    payment: Payment | null;
    onSave: (data: Payment) => void;
    onCancel: () => void;
    tenants: Tenant[];
    properties: Property[];
  }> = ({ payment, onSave, onCancel, tenants, properties }) => {
    const [formData, setFormData] = useState<Payment>(() => payment || {
      id: `p${Date.now()}`,
      tenantId: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: 'M-PESA',
      status: 'Paid',
    });

    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

    useEffect(() => {
      if (payment) {
        setFormData(payment);
      } else {
        setFormData({
          id: `p${Date.now()}`,
          tenantId: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          method: 'M-PESA',
          status: 'Paid',
        });
      }
      setErrors({});
    }, [payment]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value } as Payment));
      setErrors(prev => ({ ...prev, [id]: undefined }));
    };

    const validate = (): { [key: string]: string | undefined } => {
      const newErrors: { [key: string]: string | undefined } = {};
      if (!formData.tenantId) newErrors.tenantId = 'Tenant is required.';
      if (!formData.amount || isNaN(formData.amount) || parseFloat(String(formData.amount)) <= 0)
        newErrors.amount = 'Valid amount is required.';
      if (!formData.date) newErrors.date = 'Date is required.';
      return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        onSave({ ...formData, amount: parseFloat(String(formData.amount)) });
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <SelectField
          id="tenantId"
          label="Tenant"
          value={formData.tenantId}
          onChange={handleChange}
          error={errors.tenantId}
          options={tenants.map(t => ({
            value: t.id,
            label: `${t.name} (${properties.find(p => p.id === t.propertyId)?.name || 'N/A'})`
          }))}
          required
        />
        <InputField id="amount" type="number" label="Amount (KES)" value={formData.amount} onChange={handleChange} error={errors.amount} required min="0" />
        <InputField id="date" type="date" label="Date" value={formData.date} onChange={handleChange} error={errors.date} required />
        <SelectField
          id="method"
          label="Payment Method"
          value={formData.method}
          onChange={handleChange}
          options={[
            { value: 'M-PESA', label: 'M-PESA' },
            { value: 'Bank Transfer', label: 'Bank Transfer' },
            { value: 'Cash', label: 'Cash' }
          ]}
          required
        />
        <SelectField
          id="status"
          label="Status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'Paid', label: 'Paid' },
            { value: 'Overdue', label: 'Overdue' },
            { value: 'Pending', label: 'Pending' }
          ]}
          required
        />
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">{payment ? 'Update Payment' : 'Record Payment'}</Button>
        </div>
      </form>
    );
  };

  const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemType: string;
    itemName: string | undefined;
  }> = ({ isOpen, onClose, onConfirm, itemType, itemName }) => {
    if (!isOpen) return null;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Confirm Delete ${itemType}`}>
        <div className="p-4 text-center">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
          <p className="text-lg text-white mb-8">
            Are you sure you want to delete {itemType}{' '}
            <span className="font-bold text-red-400">"{itemName}"</span>? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm}>Delete</Button>
          </div>
        </div>
      </Modal>
    );
  };

  const paymentTableColumns = useMemo(() => [
    {
      key: 'tenantName',
      header: 'Tenant',
      render: (row: Payment) => {
        const tenant = data.tenants.find(t => t.id === row.tenantId);
        return tenant?.name || 'N/A';
      }
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: Payment) => `KES ${row.amount.toLocaleString()}`
    },
    { key: 'date', header: 'Date' },
    { key: 'method', header: 'Method' },
    {
      key: 'status',
      header: 'Status',
      render: (row: Payment) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400'
          : row.status === 'Overdue' ? 'bg-red-500/20 text-red-400'
          : 'bg-amber-500/20 text-amber-400'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Payment) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditPaymentClick(row)} title="Edit Payment">
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeletePaymentClick(row)} title="Delete Payment">
            <Trash2 size={18} />
          </Button>
          {row.status === 'Paid' && (
            <Button variant="ghost" size="sm" onClick={() => { /* TODO: view receipt */ }} title="View Receipt">
              <Receipt size={18} />
            </Button>
          )}
        </div>
      )
    }
  ], [data.tenants]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPayment ? 'Edit Payment' : 'Record New Payment'}>
        <PaymentForm
          payment={editingPayment}
          onSave={handleSavePayment}
          onCancel={() => setIsModalOpen(false)}
          tenants={landlordTenants}
          properties={landlordProperties}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={performDeletePayment}
        itemType="Payment"
        itemName={paymentToDelete ? `KES ${paymentToDelete.amount.toLocaleString()} on ${paymentToDelete.date}` : undefined}
      />

      <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h3 className="text-xl font-semibold">Rent Payments</h3>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all duration-200"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="block w-full pl-3 pr-10 py-2.5 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Pending">Pending</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            <Button onClick={handleRecordPaymentClick} className="w-full sm:w-auto">
              <PlusCircle className="mr-2" /> Record Payment
            </Button>
          </div>
        </div>
        <DataTable<Payment>
          data={filteredPayments}
          columns={paymentTableColumns}
          emptyMessage="No payments found matching your criteria."
        />
      </div>
    </>
  );
};

export default PaymentManagement;
