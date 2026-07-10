import { Building2, CalendarCheck, Heart, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import keycloak from "../configs/keycloak";

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'My Bookings', path: '/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Saved Venues', path: '/saved', icon: <Heart size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Building2 size={28} />
            <span>BookMyVenue</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button onClick={() => keycloak.logout()} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all font-medium">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
