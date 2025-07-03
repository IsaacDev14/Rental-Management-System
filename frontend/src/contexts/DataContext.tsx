// src/contexts/DataContext.tsx
import { createContext } from 'react';
import type { DataContextType } from '../types/models';

export const DataContext = createContext<DataContextType | null>(null);
