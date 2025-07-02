// frontend/src/hooks/useData.ts

import { useContext } from 'react';
import { DataContext } from '../contexts/DataContext'; // Import DataContext
import { AppData } from '../types/models'; // Import AppData for type consistency

/**
 * Interface for the DataContext value.
 * Provides access to the application's data state and functions to modify it.
 */
interface DataContextType {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  logAction: (message: string) => void;
  sendNotification: (message: string) => void;
}

/**
 * Custom hook to easily access application data and data manipulation functions.
 * Throws an error if used outside of a DataProvider.
 */
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context as DataContextType; // Type assertion as useContext can return null
};
