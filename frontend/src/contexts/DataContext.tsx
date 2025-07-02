// frontend/src/contexts/DataContext.tsx

import { createContext } from 'react';
import { AppData, AuditLogEntry, Notification } from '../types/models'; // Import necessary types

/**
 * Interface for the DataContext value.
 * This defines the shape of the data and functions that will be provided
 * through the DataContext.
 */
export interface DataContextType {
  data: AppData; // The main application data state
  setData: React.Dispatch<React.SetStateAction<AppData>>; // Function to update the data state
  logAction: (message: string) => void; // Function to add an entry to the audit log
  sendNotification: (message: string) => void; // Function to add a new notification
}

/**
 * React Context for managing the application's core data state.
 * This context will hold all the main data (properties, tenants, payments, etc.)
 * and functions to interact with that data (e.g., logging actions, sending notifications).
 *
 * It is initialized with `null` and should be provided by a DataProvider component.
 */
export const DataContext = createContext<DataContextType | null>(null);
