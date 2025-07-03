import React, { useContext, useMemo } from "react";
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

const Sidebar: React.FC<SidebarProps> = ({ navigation, activeItem, setActiveItem }) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

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
          onClick={logout}
          className="w-full flex items-center justify-center py-2 px-4 rounded-lg text-red-300 bg-red-900 hover:bg-red-800 transition-colors duration-200"
          aria-label="Logout"
        >
          <LogOut className="mr-2" size={18} aria-hidden="true" /> Logout
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;
