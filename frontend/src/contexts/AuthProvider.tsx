// src/contexts/AuthProvider.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import type { AuthUser, UserRole } from '../types/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const isAuthenticated = !!user && !!token;
  const isLoggedIn = isAuthenticated;
  const currentUserId = user?.id || null;

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = response.data;

      setUser(user);
      setToken(token);
      setRole(user.role);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Login failed');
      }
      throw new Error('Unknown login error');
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        name,
        role,
      });
      const { token, user } = response.data;

      setUser(user);
      setToken(token);
      setRole(role);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || 'Registration failed');
      }
      throw new Error('Unknown registration error');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData) as AuthUser;
        setToken(token);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (e) {
        console.error('Failed to parse user data', e);
        logout();
      }
    }
  }, [logout]);

  const authValue = useMemo(() => ({
    isLoggedIn,
    isAuthenticated,
    userRole: role,
    currentUserId,
    user,
    token,
    login,
    register,
    logout,
  }), [isLoggedIn, isAuthenticated, role, currentUserId, user, token, login, register, logout]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};
