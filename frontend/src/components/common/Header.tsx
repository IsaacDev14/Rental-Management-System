// frontend/src/components/common/Header.tsx

import React, { useState, useContext } from 'react';
import { Bell, Settings, LogOut } from 'lucide-react'; // Import necessary icons (removed X as it's not used here)
import { DataContext } from '../../contexts/DataContext'; // Import DataContext
// Removed AuthContext as it's not directly used here
import type { Notification, AppData } from '../../types/models'; // Import Notification and AppData types for explicit typing

/**
 * Props interface for the Header component.
 */
interface HeaderProps {
  title: string; // Title to display in the header (e.g., "Landlord Dashboard")
  onLogout: () => void; // Callback function for logout action
}

/**
 * Reusable Header component for the application layout.
 * Displays the current dashboard title, notification bell, settings icon, and logout button.
 * Includes a dropdown for notifications.
 */
const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  // Use non-null assertion as DataContext is guaranteed to be provided by App.tsx
  const { data, setData } = useContext(DataContext)!;
  const [showNotifications, setShowNotifications] = useState(false);

  // Calculate the number of unread notifications
  const unreadCount = data.notifications.filter((n: Notification) => !n.read).length;

  /**
   * Marks a specific notification as read.
   * @param id The ID of the notification to mark as read.
   */
  const markAsRead = (id: number) => {
    setData((prev: AppData) => ({ // Explicitly type prev as AppData
      ...prev,
      notifications: prev.notifications.map((n: Notification) => n.id === id ? { ...n, read: true } : n)
    }));
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
                  data.notifications.map((n: Notification) => ( // Explicitly type n as Notification
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
          onClick={onLogout}
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          aria-label="Logout"
        >
          <LogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
