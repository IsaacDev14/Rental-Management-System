import React, { useContext, useMemo, useState } from "react"; // Import useState
import { LogOut } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarProps {
  navigation: NavItem[];
  activeItem: string;
  setActiveItem: (itemName: string) => void;
}

// Custom Confirmation Modal Component
interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
        <p className="text-lg font-semibold text-gray-800 mb-6 text-center">{message}</p>
        <div className="flex justify-around space-x-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Yes, Log Out
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ navigation, activeItem, setActiveItem }) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State to control modal visibility

  if (!authContext) {
    throw new Error("AuthContext is undefined. Make sure your app is wrapped with AuthProvider.");
  }

  const { userRole, logout, user } = authContext;

  const userDisplay = useMemo(() => {
    if (user) return { fullName: user.name, role: user.role };

    let fullName = "Current User";
    if (userRole === "landlord") fullName = "Landlord Demo";
    else if (userRole === "tenant") fullName = "Tenant Demo";
    else if (userRole === "kra_officer") fullName = "KRA Officer";

    return { fullName, role: userRole };
  }, [userRole, user]);

  const handleClick = (itemName: string, path: string) => {
    setActiveItem(itemName);
    navigate(path);
  };

  // Function to initiate logout confirmation
  const requestLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Function to handle actual logout after confirmation
  const confirmLogout = async () => {
    setShowLogoutConfirm(false); // Close the modal
    await logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to the landing page after logout
  };

  // Function to cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false); // Close the modal
  };

  return (
    <aside
      className="w-64 bg-gray-800 text-gray-300 flex flex-col flex-shrink-0 border-r border-gray-700 shadow-xl"
      aria-label="Sidebar Navigation"
    >
      <header className="h-20 flex items-center px-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-cyan-400">RentalFlow</h1>
      </header>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick(item.name, item.path);
            }}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200
              ${
                activeItem === item.name
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(item.name, item.path);
              }
            }}
            aria-current={activeItem === item.name ? "page" : undefined}
          >
            <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
            {item.name}
          </a>
        ))}
      </nav>

      <footer className="px-4 py-6 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div
            className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white text-lg"
            aria-label={`User initial: ${userDisplay.fullName.charAt(0).toUpperCase()}`}
          >
            {userDisplay.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{userDisplay.fullName}</p>
            <p className="text-xs text-gray-400 capitalize">{userDisplay.role}</p>
          </div>
        </div>
        <button
          onClick={requestLogout} // Call requestLogout to show the confirmation modal
          className="w-full flex items-center justify-center py-2 px-4 rounded-lg text-red-300 bg-red-900 hover:bg-red-800 transition-colors duration-200"
          aria-label="Logout"
        >
          <LogOut className="mr-2" size={18} aria-hidden="true" /> Logout
        </button>
      </footer>

      {/* Confirmation Modal */}
      {showLogoutConfirm && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </aside>
  );
};

export default Sidebar;
