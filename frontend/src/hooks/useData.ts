// src/hooks/useData.ts
import { useContext, useCallback } from 'react';
import { DataContext } from '../contexts/DataContext';
import api from '../utils/api';
import type { Property, Tenant, Payment } from '../types/models';
import { useAuth } from './useAuth';

export const useData = () => {
  const context = useContext(DataContext);
  const { currentUserId } = useAuth();

  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }

  const { data, setData, logAction, sendNotification } = context;

  // --- Properties ---

  const fetchProperties = useCallback(async () => {
    try {
      if (!currentUserId) return;
      const res = await api.get(`/properties/${currentUserId}`);
      setData(prev => ({ ...prev, properties: res.data }));
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  }, [setData, currentUserId]);

  const addProperty = useCallback(async (newProperty: Partial<Property>) => {
    try {
      const res = await api.post('/properties', newProperty);
      setData(prev => ({
        ...prev,
        properties: [...prev.properties, res.data],
      }));
      logAction(`Added property: ${res.data.name}`);
      sendNotification(`Property "${res.data.name}" added.`);
    } catch (err) {
      console.error('Failed to add property:', err);
    }
  }, [setData, logAction, sendNotification]);

  const updateProperty = useCallback(async (property: Property) => {
    try {
      const res = await api.put(`/properties/${property.id}`, property);
      setData(prev => ({
        ...prev,
        properties: prev.properties.map(p => (p.id === property.id ? res.data : p)),
      }));
      logAction(`Updated property: ${property.name}`);
      sendNotification(`Property "${property.name}" updated.`);
    } catch (err) {
      console.error('Failed to update property:', err);
    }
  }, [setData, logAction, sendNotification]);

  const deleteProperty = useCallback(async (propertyId: string) => {
    try {
      await api.delete(`/properties/${propertyId}`);
      setData(prev => ({
        ...prev,
        properties: prev.properties.filter(p => p.id !== propertyId),
      }));
      logAction(`Deleted property`);
      sendNotification(`Property deleted.`);
    } catch (err) {
      console.error('Failed to delete property:', err);
    }
  }, [setData, logAction, sendNotification]);

  // --- Tenants ---

  const fetchTenants = useCallback(async () => {
    try {
      const res = await api.get('/tenants');
      setData(prev => ({ ...prev, tenants: res.data }));
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    }
  }, [setData]);

  const addTenant = useCallback(async (tenant: Omit<Tenant, 'id'>) => {
    try {
      const res = await api.post('/tenants', tenant);
      setData(prev => ({
        ...prev,
        tenants: [...prev.tenants, res.data],
      }));
      logAction(`Added tenant: ${res.data.name}`);
      sendNotification(`Tenant "${res.data.name}" added.`);
    } catch (err) {
      console.error('Failed to add tenant:', err);
    }
  }, [setData, logAction, sendNotification]);

  const updateTenant = useCallback(async (tenant: Tenant) => {
    try {
      const res = await api.put(`/tenants/${tenant.id}`, tenant);
      setData(prev => ({
        ...prev,
        tenants: prev.tenants.map(t => (t.id === tenant.id ? res.data : t)),
      }));
      logAction(`Updated tenant: ${tenant.name}`);
      sendNotification(`Tenant "${tenant.name}" updated.`);
    } catch (err) {
      console.error('Failed to update tenant:', err);
    }
  }, [setData, logAction, sendNotification]);

  const deleteTenant = useCallback(async (tenant: Tenant) => {
    try {
      await api.delete(`/tenants/${tenant.id}`);
      setData(prev => ({
        ...prev,
        tenants: prev.tenants.filter(t => t.id !== tenant.id),
      }));
      logAction(`Deleted tenant: ${tenant.name}`);
      sendNotification(`Tenant "${tenant.name}" removed.`);
    } catch (err) {
      console.error('Failed to delete tenant:', err);
    }
  }, [setData, logAction, sendNotification]);

  // --- Payments ---

  const fetchPayments = useCallback(async () => {
    try {
      const res = await api.get('/payments');
      setData(prev => ({ ...prev, payments: res.data }));
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  }, [setData]);

  const addPayment = useCallback(
    async (payment: Omit<Payment, 'id'> & { propertyId: string; unitId: string; date: string; method: string; status: string }) => {
      try {
        // Transform payment object to match backend schema
        const preparedPayment = {
          tenantId: payment.tenantId,
          propertyId: payment.propertyId,  // MUST be provided by caller
          unitId: payment.unitId,          // MUST be provided by caller
          amount: payment.amount,
          paymentDate: new Date(payment.date),  // convert from string date to Date
          paymentMethod: payment.method,
          // Map status to backend enum
          status:
            payment.status === 'Paid'
              ? 'Completed'
              : ['Pending', 'Completed', 'Failed'].includes(payment.status)
              ? payment.status
              : 'Pending',
        };

        const res = await api.post('/payments', preparedPayment);
        setData(prev => ({
          ...prev,
          payments: [...(prev.payments || []), res.data],
        }));
        logAction(`Added payment for tenant ID: ${res.data.tenantId}`);
        sendNotification(`Payment recorded.`);
      } catch (err) {
        console.error('Failed to add payment:', err);
      }
    },
    [setData, logAction, sendNotification]
  );

  const updatePayment = useCallback(async (payment: Payment) => {
    try {
      const res = await api.put(`/payments/${payment.id}`, payment);
      setData(prev => ({
        ...prev,
        payments: prev.payments.map(p => (p.id === payment.id ? res.data : p)),
      }));
      logAction(`Updated payment ID: ${payment.id}`);
      sendNotification(`Payment updated.`);
    } catch (err) {
      console.error('Failed to update payment:', err);
    }
  }, [setData, logAction, sendNotification]);

  const deletePayment = useCallback(async (paymentId: string) => {
    try {
      await api.delete(`/payments/${paymentId}`);
      setData(prev => ({
        ...prev,
        payments: prev.payments.filter(p => p.id !== paymentId),
      }));
      logAction(`Deleted payment ID: ${paymentId}`);
      sendNotification(`Payment deleted.`);
    } catch (err) {
      console.error('Failed to delete payment:', err);
    }
  }, [setData, logAction, sendNotification]);

  return {
    data,
    setData,
    logAction,
    sendNotification,

    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,

    fetchTenants,
    addTenant,
    updateTenant,
    deleteTenant,

    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment,
  };
};
