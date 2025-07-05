import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DataContext } from './DataContext';
import type { AppData, DataContextType } from '../types/models';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

interface DataProviderProps {
  children: React.ReactNode;
}

const initialData: AppData = {
  landlords: [],
  properties: [],
  tenants: [],
  payments: [],
  expenses: [],
  deposits: [],
  auditLog: [],
  notifications: [],
  investmentFunds: [],
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);
  const { currentUserId } = useAuth();

  const logAction = useCallback((message: string) => {
    setData(prev => ({
      ...prev,
      auditLog: [{ id: Date.now(), timestamp: new Date(), message }, ...prev.auditLog],
    }));
  }, []);

  const sendNotification = useCallback((message: string) => {
    setData(prev => ({
      ...prev,
      notifications: [{ id: Date.now(), read: false, message }, ...prev.notifications],
    }));
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      if (!currentUserId) return;
      const res = await api.get(`/properties/${currentUserId}`);
      setData(prev => ({ ...prev, properties: res.data }));
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  }, [currentUserId]);

  const fetchTenants = useCallback(async () => {
    try {
      const res = await api.get('/tenants');
      setData(prev => ({ ...prev, tenants: res.data }));
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchProperties();
      fetchTenants();
    }
  }, [currentUserId, fetchProperties, fetchTenants]);

  const dataValue: DataContextType = useMemo(() => ({
    data,
    setData,
    logAction,
    sendNotification,
  }), [data, logAction, sendNotification]);

  return <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>;
};
