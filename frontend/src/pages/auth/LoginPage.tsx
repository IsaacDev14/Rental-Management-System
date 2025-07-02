// frontend/src/pages/auth/LoginPage.tsx

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Import icon for dropdown
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import { UserRole } from '../../types/auth'; // Import UserRole type
import { initialData as dummyInitialData } from '../../utils/data'; // Import dummy data for user IDs

/**
 * Props interface for the LoginPage component.
 */
interface LoginPageProps {
  onRegisterClick: () => void; // Callback to switch to the registration page
}

/**
 * LoginPage component for user authentication.
 * Allows users to "log in" by selecting a role (Landlord, Tenant, KRA Officer)
 * and provides a link to the registration page.
 * (Note: Credentials are not validated in this demo.)
 */
const LoginPage: React.FC<LoginPageProps> = ({ onRegisterClick }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('landlord'); // Default role

  /**
   * Handles the login form submission.
   * Based on the selected role, it calls the login function from AuthContext
   * with a dummy user ID for demonstration purposes.
   */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let userId: string | null = null;

    // Assign a dummy user ID based on the selected role for demo purposes
    if (selectedRole === 'tenant' && dummyInitialData.tenants.length > 0) {
      userId = dummyInitialData.tenants[0].id; // Use the first dummy tenant
    } else if (selectedRole === 'landlord' && dummyInitialData.landlords.length > 0) {
      userId = dummyInitialData.landlords[0].id; // Use the first dummy landlord
    }
    // KRA Officer doesn't need a specific ID in this demo, as it's a generic view

    login(selectedRole, userId); // Call login from AuthContext
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-cyan-400 mb-2">RentalFlow</h1>
          <h2 className="text-2xl font-bold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            For demonstration, credentials are not validated.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                placeholder="Username (e.g., any text)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                placeholder="Password (e.g., any text)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="role-select" className="block text-sm font-medium text-gray-300 mb-2">Login as:</label>
            <div className="relative">
              <select
                id="role-select"
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="block w-full pl-4 pr-10 py-3 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 rounded-lg text-white appearance-none transition-all duration-200"
              >
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
                <option value="kra_officer">KRA Officer</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button onClick={onRegisterClick} className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
