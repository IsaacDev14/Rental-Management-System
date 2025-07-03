// frontend/src/pages/auth/RegisterPage.tsx

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth';

interface RegisterPageProps {
  onLoginClick: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onLoginClick }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('landlord');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await register(email, password, name, selectedRole);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-md w-full bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-cyan-400 text-center mb-6">Register</h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            required
          />

          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 appearance-none"
            >
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
              <option value="kra_officer">KRA Officer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="text-cyan-400 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
