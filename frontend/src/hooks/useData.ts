import { useContext, useCallback } from 'react';
import { DataContext } from '../contexts/DataContext';
import api from '../utils/api';
import type { Property, Tenant } from '../types/models';
import { useAuth } from './useAuth';

export const useData = () => {
  const context = useContext(DataContext);
  const { currentUserId } = useAuth();

  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }

  const { data, setData, logAction, sendNotification } = context;

  const fetchProperties = useCallback(async () => {
    try {
      const res = await api.get(`/properties/${currentUserId}`);
      setData(prev => ({ ...prev, properties: res.data }));
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  }, [setData, currentUserId]);

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
    } catch (err) {
      console.error('Failed to update tenant:', err);
    }
  }, [setData, logAction]);

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

  // Add a property
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

  // **Update a property**
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

  // **Delete a property**
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

  return {
    data,
    setData,
    logAction,
    sendNotification,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty, // <-- add these two
    fetchTenants,
    addTenant,
    updateTenant,
    deleteTenant,
  };
};
