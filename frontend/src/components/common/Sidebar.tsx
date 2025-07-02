import React, { useContext, useMemo } from 'react';
import { LogOut } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';

// Removed unused import: import type { UserRole } from '../../types/auth';

interface NavItem {
  name: string;
  icon: React.ElementType;
}

interface SidebarProps {
  navigation: NavItem[];
  activeItem: string;
  setActiveItem: (itemName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navigation, activeItem, setActiveItem }) => {
  const { userRole, logout } = useContext(AuthContext)!;

  const DUMMY_USER = useMemo(() => {
    let fullName = 'Current User';
    if (userRole === 'landlord') fullName = 'Landlord Demo';
    if (userRole === 'tenant') fullName = 'Tenant Demo';
    if (userRole === 'kra_officer') fullName = 'KRA Officer';

    return { fullName, role: userRole };
  }, [userRole]);

  return (
    <div className="w-64 bg-gray-800 text-gray-300 flex flex-col flex-shrink-0 border-r border-gray-700 shadow-xl">
      <div className="h-20 flex items-center px-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-cyan-400">RentalFlow</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveItem(item.name);
            }}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200
              ${activeItem === item.name ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 hover:text-white'}`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </a>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white text-lg">
            {DUMMY_USER.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{DUMMY_USER.fullName}</p>
            <p className="text-xs text-gray-400 capitalize">{DUMMY_USER.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center py-2 px-4 rounded-lg text-red-300 bg-red-900 hover:bg-red-800 transition-colors duration-200"
        >
          <LogOut className="mr-2" size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
