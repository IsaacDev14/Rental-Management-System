import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
// Import all Lucide React icons that will be used across the application
import {
  ChevronDown, ChevronUp, PlusCircle, Edit, Trash2, FileText, User, Home, DollarSign,
  TrendingUp, Bell, LogOut, Eye, Search, Filter, Settings, Shield, Briefcase, BarChart2,
  FilePlus, Users, Building, Calendar, AlertTriangle, CheckCircle, Clock, X, MoreVertical,
  History, Mail, Phone, FileWarning, MapPin, Check, Wallet, Receipt, TrendingDown, Landmark,
  MessageSquare, ClipboardList, TrendingUp as TrendingUpIcon // Renamed to avoid conflict
} from 'lucide-react';

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
import Sidebar from './components/common/Sidebar';

// Import initial dummy data
import { initialData as dummyInitialData } from './utils/data';

/**
 * AuthProvider component.
 * Manages the authentication state for the application.
 * Provides login, register, and logout functionalities.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null); // 'landlord', 'tenant', 'kra_officer'
    const [currentUserId, setCurrentUserId] = useState<string | null>(null); // ID of the logged-in user (landlord/tenant)

    const login = (role: string, userId: string | null = null) => {
        setIsLoggedIn(true);
        setUserRole(role);
        setCurrentUserId(userId);
        console.log(`Logged in as ${role} with ID: ${userId}`);
    };

    const register = (role: string, userId: string | null = null) => {
        // In a real app, this would involve API calls to create a new user.
        // For this demo, registration immediately logs them in.
        login(role, userId);
        console.log(`Registered and logged in as ${role} with ID: ${userId}`);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentUserId(null);
        console.log('Logged out');
    };

    const authValue = useMemo(() => ({
        isLoggedIn,
        userRole,
        currentUserId,
        login,
        register,
        logout
    }), [isLoggedIn, userRole, currentUserId]);

    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

/**
 * DataProvider component.
 * Manages the application's core data state.
 * Provides functions to log actions and send notifications.
 */
const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState(dummyInitialData);

    const logAction = (message: string) => {
        setData(prev => ({
            ...prev,
            auditLog: [{ id: Date.now(), timestamp: new Date(), message }, ...prev.auditLog]
        }));
    };
    
    const sendNotification = (message: string) => {
        setData(prev => ({
            ...prev,
            notifications: [{ id: Date.now(), read: false, message }, ...prev.notifications]
        }))
    }

    const dataValue = useMemo(() => ({
        data,
        setData,
        logAction,
        sendNotification
    }), [data]);

    return <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>;
};

/**
 * AuthWrapper component.
 * Handles conditional rendering based on authentication status.
 * Displays Login/Register pages if not logged in, otherwise the main RentalManagementSystem.
 */
function AuthWrapper() {
    const { isLoggedIn } = useContext(AuthContext);
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
    const { userRole, logout } = useContext(AuthContext);
    const [activeRole, setActiveRole] = useState(userRole);

    // Sync activeRole with logged-in userRole when it changes (e.g., after login)
    useEffect(() => {
        if (userRole) {
            setActiveRole(userRole);
        }
    }, [userRole]);

    // Determine which dashboard to render based on the active role
    const renderDashboard = () => {
        switch (activeRole) {
            case 'landlord': return <LandlordDashboard />;
            case 'tenant': return <TenantDashboard />;
            case 'kra_officer': return <KRADashboard />;
            default: return <LandlordDashboard />; // Default to landlord for safety
        }
    };

    return (
        <div className="flex bg-gray-900 font-sans text-white h-screen overflow-hidden">
            {/* Role Switcher (Sidebar for changing user roles in demo) */}
            <RoleSwitcher activeRole={activeRole} setActiveRole={setActiveRole} />
            <div className="flex-1 flex flex-col">
                {/* Main Header */}
                <Header title={activeRole ? activeRole.charAt(0).toUpperCase() + activeRole.slice(1) + ' Dashboard' : 'Dashboard'} onLogout={logout} />
                {/* Render the active dashboard */}
                {renderDashboard()}
            </div>
        </div>
    );
}

/**
 * RoleSwitcher component.
 * Allows switching between different user roles in the demo.
 */
function RoleSwitcher({ activeRole, setActiveRole }: { activeRole: string | null, setActiveRole: (role: string) => void }) {
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
                    onClick={() => setActiveRole(role.id)}
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
