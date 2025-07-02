// frontend/src/pages/auth/RegisterPage.tsx

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Import icon for dropdown
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import { UserRole } from '../../types/auth'; // Import UserRole type
import { initialData as dummyInitialData } from '../../utils/data'; // Import dummy data for user IDs

/**
 * Props interface for the RegisterPage component.
 */
interface RegisterPageProps {
  onLoginClick: () => void; // Callback to switch to the login page
}

/**
 * RegisterPage component for user registration.
 * Allows users to "register" by selecting a role.
 * (Note: Credentials are not validated, and no actual user creation occurs in this demo.)
 */
const RegisterPage: React.FC<RegisterPageProps> = ({ onLoginClick }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('landlord'); // Default role

  /**
   * Handles the registration form submission.
   * Calls the register function from AuthContext with a dummy user ID.
   */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    // for actual user creation and validation.
    // For this demo, we'll just simulate registration by logging in.

    let userId: string | null = null;
    if (selectedRole === 'tenant' && dummyInitialData.tenants.length > 0) {
      userId = dummyInitialData.tenants[0].id; // Use the first dummy tenant
    } else if (selectedRole === 'landlord' && dummyInitialData.landlords.length > 0) {
      userId = dummyInitialData.landlords[0].id; // Use the first dummy landlord
    }
    // KRA Officer doesn't need a specific ID in this demo

    register(selectedRole, userId); // Call register from AuthContext
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-cyan-400 mb-2">RentalFlow</h1>
          <h2 className="text-2xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            For demonstration, credentials are not validated.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="reg-username" className="sr-only">Username</label>
              <input
                id="reg-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="sr-only">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-role-select" className="block text-sm font-medium text-gray-300 mb-2">Register as:</label>
            <div className="relative">
              <select
                id="reg-role-select"
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
              Register
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button onClick={onLoginClick} className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
