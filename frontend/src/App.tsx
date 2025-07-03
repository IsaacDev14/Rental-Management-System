import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Building, Users, DollarSign, FileText, FilePlus,
  History, BarChart2, Shield
} from 'lucide-react';

import { AuthContext } from './contexts/AuthContext';
import { DataContext } from './contexts/DataContext';

import LandlordDashboard from './pages/dashboards/LandlordDashboard';
import TenantDashboard from './pages/dashboards/TenantDashboard';
import KRADashboard from './pages/dashboards/KRADashboard';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';

import PropertyManagement from './pages/management/PropertyManagement';
import TenantManagement from './pages/management/TenantManagement';
import PaymentManagement from './pages/management/PaymentManagement';
import ExpenseTracking from './pages/management/ExpenseTracking';
import RentalDepositInvestment from './pages/management/RentalDepositInvestment';
import Reports from './pages/reports/Reports';
import AuditLogView from './pages/audit/AuditLogView';

import type { UserRole } from './types/auth';
import type { AppData } from './types/models';
import type { AuthContextType } from './types/auth';
import type { DataContextType } from './contexts/DataContext';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const login = useCallback((role: UserRole, userId: string | null = null) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentUserId(userId || (role === 'landlord' ? 'landlord-demo-id' : role === 'tenant' ? 'tenant-demo-id' : null));
    console.log(`Logged in as ${role} with ID: ${userId || 'demo-id'}`);
  }, []);

  const register = useCallback((role: UserRole, userId: string | null = null) => {
    login(role, userId || `new-${role}-id`);
    console.log(`Registered and logged in as ${role}`);
  }, [login]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUserId(null);
    console.log('Logged out');
  }, []);

  const authValue: AuthContextType = useMemo(() => ({
    isLoggedIn, userRole, currentUserId, login, register, logout
  }), [isLoggedIn, userRole, currentUserId, login, register, logout]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<AppData>({
    landlords: [],
    properties: [],
    tenants: [],
    payments: [],
    expenses: [],
    deposits: [],
    auditLog: [],
    notifications: [],
    investmentFunds: []
  });

  const logAction = useCallback((message: string) => {
    setData((prev) => ({
      ...prev,
      auditLog: [{ id: Date.now(), timestamp: new Date(), message }, ...prev.auditLog]
    }));
  }, []);

  const sendNotification = useCallback((message: string) => {
    setData((prev) => ({
      ...prev,
      notifications: [{ id: Date.now(), read: false, message }, ...prev.notifications]
    }));
  }, []);

  const dataValue: DataContextType = useMemo(() => ({
    data, setData, logAction, sendNotification
  }), [data, logAction, sendNotification]);

  return <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>;
};

function AuthWrapper() {
  const { isLoggedIn } = React.useContext(AuthContext)!;
  const [showRegister, setShowRegister] = useState(false);

  if (!isLoggedIn) {
    return showRegister
      ? <RegisterPage onLoginClick={() => setShowRegister(false)} />
      : <LoginPage onRegisterClick={() => setShowRegister(true)} />;
  }

  return <RentalManagementSystem />;
}

function RentalManagementSystem() {
  const { userRole, logout } = React.useContext(AuthContext)!;
  const [activeItem, setActiveItem] = useState('Dashboard');

  useEffect(() => {
    if (userRole) {
      setActiveItem('Dashboard');
    }
  }, [userRole]);

  const landlordNav = [
    { name: 'Dashboard', icon: BarChart2 },
    { name: 'Properties', icon: Building },
    { name: 'Tenants', icon: Users },
    { name: 'Payments', icon: DollarSign },
    { name: 'Expenses', icon: FileText },
    { name: 'Deposits', icon: Shield },
    { name: 'Reports', icon: FilePlus },
    { name: 'Audit Log', icon: History }
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        switch (userRole) {
          case 'landlord': return <LandlordDashboard />;
          case 'tenant': return <TenantDashboard />;
          case 'kra_officer': return <KRADashboard />;
          default: return <LandlordDashboard />;
        }
      case 'Properties': return <PropertyManagement />;
      case 'Tenants': return <TenantManagement />;
      case 'Payments': return <PaymentManagement />;
      case 'Expenses': return <ExpenseTracking />;
      case 'Deposits': return <RentalDepositInvestment />;
      case 'Reports': return <Reports />;
      case 'Audit Log': return <AuditLogView />;
      default: return <LandlordDashboard />;
    }
  };

  return (
    <div className="flex bg-gray-900 font-sans text-white h-screen overflow-hidden">
      <Sidebar navigation={landlordNav} activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header title={activeItem} onLogout={logout} />
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AuthWrapper />
      </DataProvider>
    </AuthProvider>
  );
}
