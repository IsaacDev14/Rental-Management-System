// types/auth.ts

export type UserRole = 'landlord' | 'tenant' | 'kra_officer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // add other user fields if needed
}

export interface AuthContextType {
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  currentUserId: string | null;
  user: AuthUser | null;
  token: string | null;

  login: (email: string, password: string) => Promise<AuthUser>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<AuthUser>;
  logout: () => void;
}
