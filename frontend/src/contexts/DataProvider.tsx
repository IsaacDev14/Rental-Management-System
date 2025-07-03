// src/contexts/DataProvider.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { DataContext } from './DataContext';
import type { AppData, DataContextType } from '../types/models';

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

  const logAction = useCallback((message: string) => {
    setData((prev) => ({
      ...prev,
      auditLog: [{ id: Date.now(), timestamp: new Date(), message }, ...prev.auditLog],
    }));
  }, []);

  const sendNotification = useCallback((message: string) => {
    setData((prev) => ({
      ...prev,
      notifications: [{ id: Date.now(), read: false, message }, ...prev.notifications],
    }));
  }, []);

  const dataValue: DataContextType = useMemo(() => ({
    data,
    setData,
    logAction,
    sendNotification,
  }), [data, logAction, sendNotification]);

  return <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>;
};
