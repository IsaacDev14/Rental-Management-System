// frontend/src/types/auth.d.ts

/**
 * Defines the possible roles a user can have in the system.
 */
export type UserRole = 'landlord' | 'tenant' | 'kra_officer';

/**
 * Interface for the authentication context value.
 * Provides access to login status, user role, current user ID, and auth actions.
 */
export interface AuthContextType {
  isLoggedIn: boolean;
  userRole: UserRole | null;
  currentUserId: string | null; // ID of the currently logged-in landlord or tenant
  login: (role: UserRole, userId?: string | null) => void;
  register: (role: UserRole, userId?: string | null) => void;
  logout: () => void;
}
