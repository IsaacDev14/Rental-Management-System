import { useContext, useCallback } from 'react';
import { DataContext } from '../contexts/DataContext';
import api from '../utils/api';
import type { Property } from '../types/models';
import { useAuth } from './useAuth';

export const useData = () => {
  const context = useContext(DataContext);
  const { currentUserId } = useAuth();

  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }

  const { data, setData, logAction, sendNotification } = context;

  // ✅ Fetch only the properties for this landlord
  const fetchProperties = useCallback(async () => {
    try {
      const res = await api.get(`/properties/${currentUserId}`);
      setData(prev => ({ ...prev, properties: res.data }));
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  }, [setData, currentUserId]);

  //  Add a property and sync it into context
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

  return {
    data,
    setData,
    logAction,
    sendNotification,
    fetchProperties,
    addProperty,
  };
};
