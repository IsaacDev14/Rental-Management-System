import React, { useState, useEffect, useContext } from 'react';
import {
  Building, Users, DollarSign, FileText, FilePlus,
  History, BarChart2, Shield
} from 'lucide-react';

import { AuthContext } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthProvider';
import { DataProvider } from './contexts/DataProvider';

// Dashboard imports
import LandlordDashboard from './pages/dashboards/LandlordDashboard';
import TenantDashboard from './pages/dashboards/TenantDashboard';
import KRADashboard from './pages/dashboards/KRADashboard';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';

// Management pages
import PropertyManagement from './pages/management/PropertyManagement';
import TenantManagement from './pages/management/TenantManagement';
import PaymentManagement from './pages/management/PaymentManagement';
import ExpenseTracking from './pages/management/ExpenseTracking';
import RentalDepositInvestment from './pages/management/RentalDepositInvestment';

// Other pages
import Reports from './pages/reports/Reports';
import AuditLogView from './pages/audit/AuditLogView';

interface NavItem {
  name: string;
  icon: React.ElementType;
}

const AuthWrapper: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { isLoggedIn } = authContext;

  if (!isLoggedIn) {
    return showRegister ? (
      <RegisterPage onLoginClick={() => setShowRegister(false)} />
    ) : (
      <LoginPage onRegisterClick={() => setShowRegister(true)} />
    );
  }

  return <RentalManagementSystem />;
};

const RentalManagementSystem: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [activeItem, setActiveItem] = useState('Dashboard');

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { userRole, logout } = authContext;

  useEffect(() => {
    if (userRole) {
      setActiveItem('Dashboard');
    }
  }, [userRole]);

  const landlordNav: NavItem[] = [
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
    if (!userRole) return <LandlordDashboard />;

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
      <Sidebar 
        navigation={landlordNav} 
        activeItem={activeItem} 
        setActiveItem={setActiveItem} 
      />
      <div className="flex-1 flex flex-col">
        <Header 
          title={activeItem}
          onLogout={logout} 
        />
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AuthWrapper />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;