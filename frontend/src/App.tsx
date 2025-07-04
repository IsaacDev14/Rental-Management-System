import React, { useEffect, useContext, useState } from "react"; // Re-added useState
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

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Dashboard imports
import LandlordDashboard from "./pages/dashboards/LandlordDashboard";
import TenantDashboard from "./pages/dashboards/TenantDashboard";
import KRADashboard from "./pages/dashboards/KRADashboard";
import LandingPage from "./pages/dashboards/LandingPage"; // Import LandingPage

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
  path: string;
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

// This component will handle the login/register page toggling
const AuthPageWrapper: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  // If user is already logged in, redirect them to the dashboard
  useEffect(() => {
    if (authContext?.isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [authContext?.isLoggedIn, navigate]);

  if (authContext?.isLoggedIn) {
    return null; // Don't render anything if already logged in (will redirect)
  }

  return showRegister ? (
    <RegisterPage onLoginClick={() => setShowRegister(false)} />
  ) : (
    <LoginPage onRegisterClick={() => setShowRegister(true)} />
  );
};


// This component will act as a protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authContext || !authContext.isLoggedIn) {
      // Redirect to login if not authenticated
      navigate("/login", { replace: true });
    }
  }, [authContext, navigate]);

  if (!authContext || !authContext.isLoggedIn) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>; // Render children if authenticated
};

const RentalManagementSystem: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userRole, logout } = authContext;
  const location = useLocation();
  const navigate = useNavigate();

  // Find active nav item based on if current path *starts with* the nav path
  const activeItem =
    landlordNav.find((nav) => location.pathname.startsWith(nav.path))?.name || "Dashboard";

  // Redirect to dashboard if at root of authenticated system or unknown path
  useEffect(() => {
    // This useEffect ensures that if a user is logged in and tries to go to a non-existent
    // authenticated path, they are redirected to their dashboard.
    // It should *not* redirect from '/' as '/' is now handled by LandingPage.
    if (!landlordNav.some((nav) => location.pathname.startsWith(nav.path)) && location.pathname !== "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Render page based on path and user role
  const renderContent = () => {
    if (location.pathname.startsWith("/dashboard")) {
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
    } else if (location.pathname.startsWith("/properties")) {
      return <PropertyManagement />;
    } else if (location.pathname.startsWith("/tenants")) {
      return <TenantManagement />;
    } else if (location.pathname.startsWith("/payments")) {
      return <PaymentManagement />;
    } else if (location.pathname.startsWith("/expenses")) {
      return <ExpenseTracking />;
    } else if (location.pathname.startsWith("/deposits")) {
      return <RentalDepositInvestment />;
    } else if (location.pathname.startsWith("/reports")) {
      return <Reports />;
    } else if (location.pathname.startsWith("/audit-log")) {
      return <AuditLogView />;
    } else {
      // Fallback for any other path within the authenticated system
      return <LandlordDashboard />;
    }
  };

  const handleSetActiveItem = (itemName: string) => {
    const navItem = landlordNav.find((n) => n.name === itemName);
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
          <Routes>
            {/* Public Landing Page - accessible without login */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Pages - wrapped in AuthPageWrapper */}
            <Route path="/login" element={<AuthPageWrapper />} />
            {/* The /register route is now handled internally by AuthPageWrapper */}

            {/* Protected Routes - require authentication */}
            {/* All routes under /dashboard, /properties, etc., will be protected */}
            <Route path="/*" element={
              <ProtectedRoute>
                <RentalManagementSystem />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
