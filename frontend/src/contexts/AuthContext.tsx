// src/contexts/AuthContext.tsx

import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

// Create the context (no logic here)
export const AuthContext = createContext<AuthContextType | null>(null);
