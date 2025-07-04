import React, { useState, useContext } from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { DataContext } from '../../contexts/DataContext';
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import type { Notification, AppData } from '../../types/models';

/**
 * Props interface for the Header component.
 */
interface HeaderProps {
  title: string; // Title to display in the header (e.g., "Landlord Dashboard")
  // onLogout: () => void; // This prop will now be handled internally by this component
}

// Custom Confirmation Modal Component (copied from Sidebar for self-containment)
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


/**
 * Reusable Header component for the application layout.
 * Displays the current dashboard title, notification bell, settings icon, and logout button.
 * Includes a dropdown for notifications.
 */
const Header: React.FC<HeaderProps> = ({ title }) => {
  const { data, setData } = useContext(DataContext)!;
  const authContext = useContext(AuthContext); // Get AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for logout confirmation modal

  if (!authContext) {
    throw new Error("AuthContext is undefined. Make sure your app is wrapped with AuthProvider.");
  }

  const { logout } = authContext; // Destructure logout from AuthContext

  // Calculate the number of unread notifications
  const unreadCount = data.notifications.filter((n: Notification) => !n.read).length;

  /**
   * Marks a specific notification as read.
   * @param id The ID of the notification to mark as read.
   */
  const markAsRead = (id: number) => {
    setData((prev: AppData) => ({
      ...prev,
      notifications: prev.notifications.map((n: Notification) => n.id === id ? { ...n, read: true } : n)
    }));
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
    <header className="bg-gray-800 shadow-lg h-20 flex items-center justify-between px-8 z-20 flex-shrink-0 border-b border-gray-700">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex items-center space-x-6">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-400 hover:text-white relative p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            aria-label={`View notifications, ${unreadCount} unread`}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-gray-700 rounded-xl shadow-2xl overflow-hidden border border-gray-600 animate-fade-in-down">
              <div className="p-4 font-semibold border-b border-gray-600 text-lg text-white">Notifications</div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {data.notifications.length > 0 ? (
                  data.notifications.map((n: Notification) => (
                    <div
                      key={n.id}
                      className={`p-4 border-b border-gray-600 ${n.read ? 'opacity-60 bg-gray-750' : 'hover:bg-gray-600'} transition-colors duration-200`}
                    >
                      <p className="text-sm text-gray-200">{n.message}</p>
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-xs text-cyan-400 hover:underline mt-2"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-400">No new notifications.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>

        {/* Logout Button */}
        <button
          onClick={requestLogout} // Call requestLogout to show the confirmation modal
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          aria-label="Logout"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showLogoutConfirm && (
        <ConfirmationModal
          message="Are you sure you want to log out?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </header>
  );
};

export default Header;
