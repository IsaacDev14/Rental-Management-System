// src/App.tsx

import React, { useState, useEffect, useContext } from "react";
import {
  Building,
  Users,
  DollarSign,
  FileText,
  FilePlus,
  History,
  BarChart2,
  Shield,
} from "lucide-react";

import { AuthContext } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthProvider";
import { DataProvider } from "./contexts/DataProvider";

import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";

// Dashboard imports
import LandlordDashboard from "./pages/dashboards/LandlordDashboard";
import TenantDashboard from "./pages/dashboards/TenantDashboard";
import KRADashboard from "./pages/dashboards/KRADashboard";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Components
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";

// Management pages
import PropertyManagement from "./pages/management/PropertyManagement";
import TenantManagement from "./pages/management/TenantManagement";
import PaymentManagement from "./pages/management/PaymentManagement";
import ExpenseTracking from "./pages/management/ExpenseTracking";
import RentalDepositInvestment from "./pages/management/RentalDepositInvestment";

// Other pages
import Reports from "./pages/reports/Reports";
import AuditLogView from "./pages/audit/AuditLogView";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string; // add path for routing
}

const landlordNav: NavItem[] = [
  { name: "Dashboard", icon: BarChart2, path: "/dashboard" },
  { name: "Properties", icon: Building, path: "/properties" },
  { name: "Tenants", icon: Users, path: "/tenants" },
  { name: "Payments", icon: DollarSign, path: "/payments" },
  { name: "Expenses", icon: FileText, path: "/expenses" },
  { name: "Deposits", icon: Shield, path: "/deposits" },
  { name: "Reports", icon: FilePlus, path: "/reports" },
  { name: "Audit Log", icon: History, path: "/audit-log" },
];

const AuthWrapper: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
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

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userRole, logout } = authContext;
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active item from URL path
  const activeItem = landlordNav.find(nav => location.pathname.startsWith(nav.path))?.name || "Dashboard";

  // Redirect user to /dashboard on login or if unknown path
  useEffect(() => {
    if (location.pathname === "/" || !landlordNav.some(nav => location.pathname.startsWith(nav.path))) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Render page based on path and userRole
  const renderContent = () => {
    switch (location.pathname) {
      case "/dashboard":
        switch (userRole) {
          case "landlord":
            return <LandlordDashboard />;
          case "tenant":
            return <TenantDashboard />;
          case "kra_officer":
            return <KRADashboard />;
          default:
            return <LandlordDashboard />;
        }
      case "/properties":
        return <PropertyManagement />;
      case "/tenants":
        return <TenantManagement />;
      case "/payments":
        return <PaymentManagement />;
      case "/expenses":
        return <ExpenseTracking />;
      case "/deposits":
        return <RentalDepositInvestment />;
      case "/reports":
        return <Reports />;
      case "/audit-log":
        return <AuditLogView />;
      default:
        return <LandlordDashboard />;
    }
  };

  // On sidebar click, navigate to the path
  const handleSetActiveItem = (itemName: string) => {
    const navItem = landlordNav.find(n => n.name === itemName);
    if (navItem) {
      navigate(navItem.path);
    }
  };

  return (
    <div className="flex bg-gray-900 font-sans text-white h-screen overflow-hidden">
      <Sidebar navigation={landlordNav} activeItem={activeItem} setActiveItem={handleSetActiveItem} />
      <div className="flex-1 flex flex-col">
        <Header title={activeItem} onLogout={logout} />
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">{renderContent()}</div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AuthWrapper />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
