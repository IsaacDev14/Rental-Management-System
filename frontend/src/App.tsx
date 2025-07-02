import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Import only the Lucide React icons directly used in App.tsx (RoleSwitcher and landlordNav)
import { Briefcase, User, Shield, Building, Users, DollarSign, FileText, FilePlus, History, BarChart2 } from 'lucide-react';

// Import contexts
import { AuthContext } from './contexts/AuthContext';
import { DataContext } from './contexts/DataContext';

// Import pages/dashboards
import LandlordDashboard from './pages/dashboards/LandlordDashboard';
import TenantDashboard from './pages/dashboards/TenantDashboard';
import KRADashboard from './pages/dashboards/KRADashboard';

// Import auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Import common components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar'; // Sidebar is used directly in RentalManagementSystem

// Import page components used in renderDashboard
import PropertyManagement from './pages/management/PropertyManagement';
import TenantManagement from './pages/management/TenantManagement';
import PaymentManagement from './pages/management/PaymentManagement';
import ExpenseTracking from './pages/management/ExpenseTracking';
import RentalDepositInvestment from './pages/management/RentalDepositInvestment';
import Reports from './pages/reports/Reports';
import AuditLogView from './pages/audit/AuditLogView';

// Import types
import type { UserRole } from './types/auth'; // Use type-only import
import type { AppData } from './types/models'; // Use type-only import
import type { AuthContextType } from './types/auth'; // Use type-only import
import type { DataContextType } from './contexts/DataContext'; // Use type-only import

/**
 * AuthProvider component.
 * Manages the authentication state for the application.
 * Provides login, register, and logout functionalities.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Explicitly type userRole state
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Wrap functions in useCallback to stabilize their references
    const login = useCallback((role: UserRole, userId: string | null = null) => {
        setIsLoggedIn(true);
        setUserRole(role);
        // For demo, assign a generic ID if specific userId isn't provided
        setCurrentUserId(userId || (role === 'landlord' ? 'landlord-demo-id' : role === 'tenant' ? 'tenant-demo-id' : null));
        console.log(`Logged in as ${role} with ID: ${userId || (role === 'landlord' ? 'landlord-demo-id' : role === 'tenant' ? 'tenant-demo-id' : 'N/A')}`);
    }, []);

    const register = useCallback((role: UserRole, userId: string | null = null) => {
        // In a real app, this would involve API calls to create a new user.
        // For this demo, registration immediately logs them in with a generic ID.
        login(role, userId || (role === 'landlord' ? 'new-landlord-id' : role === 'tenant' ? 'new-tenant-id' : null));
        console.log(`Registered and logged in as ${role} with ID: ${userId || (role === 'landlord' ? 'new-landlord-id' : role === 'tenant' ? 'new-tenant-id' : 'N/A')}`);
    }, [login]);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentUserId(null);
        console.log('Logged out');
    }, []);

    const authValue: AuthContextType = useMemo(() => ({
        isLoggedIn,
        userRole,
        currentUserId,
        login,
        register,
        logout
    }), [isLoggedIn, userRole, currentUserId, login, register, logout]);

    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

/**
 * DataProvider component.
 * Manages the application's core data state.
 * Provides functions to log actions and send notifications.
 */
const DataProvider = ({ children }: { children: React.ReactNode }) => {
    // Initial empty data, as it will be fetched from backend
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

    // Wrap functions in useCallback to stabilize their references
    const logAction = useCallback((message: string) => {
        setData((prev: AppData) => ({
            ...prev,
            auditLog: [{ id: Date.now(), timestamp: new Date(), message }, ...prev.auditLog]
        }));
    }, []);

    const sendNotification = useCallback((message: string) => {
        setData((prev: AppData) => ({
            ...prev,
            notifications: [{ id: Date.now(), read: false, message }, ...prev.notifications]
        }));
    }, []);

    const dataValue: DataContextType = useMemo(() => ({
        data,
        setData,
        logAction,
        sendNotification
    }), [data, setData, logAction, sendNotification]);

    return <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>;
};

/**
 * AuthWrapper component.
 * Handles conditional rendering based on authentication status.
 * Displays Login/Register pages if not logged in, otherwise the main RentalManagementSystem.
 */
function AuthWrapper() {
    // Use the custom useAuth hook
    const { isLoggedIn } = React.useContext(AuthContext)!; // Assert non-null as it's wrapped in AuthProvider
    const [showRegister, setShowRegister] = useState(false);

    if (!isLoggedIn) {
        return showRegister ? (
            <RegisterPage onLoginClick={() => setShowRegister(false)} />
        ) : (
            <LoginPage onRegisterClick={() => setShowRegister(true)} />
        );
    }

    return <RentalManagementSystem />;
}

/**
 * RentalManagementSystem component.
 * The main application layout and role-based dashboard rendering.
 */
function RentalManagementSystem() {
    // Use the custom useAuth hook
    const { userRole, logout } = React.useContext(AuthContext)!; // Assert non-null
    const [activeItem, setActiveItem] = useState('Dashboard'); // State for active sidebar item

    // Sync activeItem with logged-in userRole when it changes (e.g., after login)
    useEffect(() => {
        if (userRole) {
            // Set initial active item based on role, or default to Dashboard
            setActiveItem('Dashboard');
        }
    }, [userRole]);

    // Navigation items for the Landlord Dashboard sidebar.
    const landlordNav = [
        { name: 'Dashboard', icon: BarChart2 },
        { name: 'Properties', icon: Building },
        { name: 'Tenants', icon: Users },
        { name: 'Payments', icon: DollarSign },
        { name: 'Expenses', icon: FileText },
        { name: 'Deposits', icon: Shield },
        { name: 'Reports', icon: FilePlus },
        { name: 'Audit Log', icon: History },
    ];

    // Determine which dashboard/page to render based on the active item and user role
    const renderContent = () => {
        switch (activeItem) {
            case 'Dashboard':
                switch (userRole) {
                    case 'landlord': return <LandlordDashboard />;
                    case 'tenant': return <TenantDashboard />;
                    case 'kra_officer': return <KRADashboard />;
                    default: return <LandlordDashboard />; // Default to landlord for safety
                }
            case 'Properties': return <PropertyManagement />;
            case 'Tenants': return <TenantManagement />;
            case 'Payments': return <PaymentManagement />;
            case 'Expenses': return <ExpenseTracking />;
            case 'Deposits': return <RentalDepositInvestment />;
            case 'Reports': return <Reports />;
            case 'Audit Log': return <AuditLogView />;
            default: return <LandlordDashboard />; // Fallback
        }
    };

    return (
        <div className="flex bg-gray-900 font-sans text-white h-screen overflow-hidden">
            {/* Role Switcher (Sidebar for changing user roles in demo) */}
            <RoleSwitcher activeRole={userRole} setActiveRole={() => { /* no-op, login controls role */ }} />
            {/* Sidebar for navigation */}
            <Sidebar navigation={landlordNav} activeItem={activeItem} setActiveItem={setActiveItem} />
            <div className="flex-1 flex flex-col">
                {/* Main Header */}
                <Header title={activeItem} onLogout={logout} /> {/* Use activeItem as title */}
                {/* Render the active content */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

/**
 * RoleSwitcher component.
 * Allows switching between different user roles in the demo.
 */
function RoleSwitcher({ activeRole, setActiveRole }: { activeRole: UserRole | null, setActiveRole: (role: UserRole) => void }) {
    const roles = [
        { id: 'landlord', name: 'Landlord', icon: Briefcase },
        { id: 'tenant', name: 'Tenant', icon: User },
        { id: 'kra_officer', name: 'KRA Officer', icon: Shield },
    ];

    return (
        <div className="w-20 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-4 flex-shrink-0">
            <h1 className="text-3xl font-extrabold text-cyan-400 mb-4">RF</h1> {/* Larger logo */}
            {roles.map(role => (
                <button
                    key={role.id}
                    onClick={() => setActiveRole(role.id as UserRole)} // Ensure role.id is cast to UserRole
                    className={`p-3 rounded-xl transition-all duration-300 ${activeRole === role.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    title={role.name}
                >
                    <role.icon size={28} /> {/* Larger icons */}
                </button>
            ))}
        </div>
    );
}

/**
 * App component.
 * The root component that wraps the entire application with Auth and Data Providers.
 */
export default function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <AuthWrapper />
            </DataProvider>
        </AuthProvider>
    );
}
