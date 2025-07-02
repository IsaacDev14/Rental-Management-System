// frontend/src/contexts/AuthContext.tsx

import { createContext } from 'react';
import type { AuthContextType } from '../types/auth'; // Import the AuthContextType interface as type-only

/**
 * React Context for managing authentication state.
 * This context will hold information about user login status, role, and ID,
 * along with functions to perform authentication actions (login, register, logout).
 *
 * It is initialized with `null` and should be provided by an AuthProvider component.
 */
export const AuthContext = createContext<AuthContextType | null>(null);
