import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useRedux';
import { logoutRequest } from '@/redux/slice/authSlice';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Auto-open admin section if we're on an admin page
  const isOnAdmin = location.pathname.startsWith('/dashboard/admin');
  const [adminOpen, setAdminOpen] = useState(isOnAdmin);

  const handleLogout = () => {
    dispatch(logoutRequest());
    navigate(ROUTES.LOGIN);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors border-l-[3px] w-full cursor-pointer
    ${isActive
      ? 'border-green-600 bg-green-50 text-green-700'
      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-green-700'
    }`;

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-white border-r border-gray-200 flex flex-col z-30">
      {/* Logo */}
      <div className="h-[56px] flex items-center px-5 border-b border-gray-200 shrink-0">
        <span className="text-green-600 font-bold text-lg tracking-tight">Subak Raftar</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">

        <NavLink to={ROUTES.DASHBOARD} end className={linkClass}>
          <span className="text-green-600 font-bold text-xs leading-none">»</span>
          Dashboard
        </NavLink>

        <NavLink to={ROUTES.BOOK_PARCEL} className={linkClass}>
          <span className="text-green-600 font-bold text-xs leading-none">»</span>
          Book Parcel
        </NavLink>

        <NavLink to={ROUTES.INVOICES} className={linkClass}>
          <span className="text-green-600 font-bold text-xs leading-none">»</span>
          View Invoices
        </NavLink>

        <NavLink to={ROUTES.LOAD_SHEET} className={linkClass}>
          <span className="text-green-600 font-bold text-xs leading-none">»</span>
          Create Load Sheet
        </NavLink>

        <NavLink to={ROUTES.COMPLAINTS} className={linkClass}>
          <span className="text-green-600 font-bold text-xs leading-none">»</span>
          Add Complain
        </NavLink>

        <NavLink to={ROUTES.COURIER_PERFORMANCE} className={linkClass}>
          <span className="text-green-600 font-bold text-xs leading-none">»</span>
          Courier Analytics
        </NavLink>

        {/* Admin section */}
        {isAdmin && (
          <div className="mt-1">
            <button
              onClick={() => setAdminOpen((o) => !o)}
              className={`flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-medium border-l-[3px] transition-colors
                ${isOnAdmin
                  ? 'border-green-600 bg-green-50 text-green-700'
                  : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-green-700'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-green-600 font-bold text-xs leading-none">»</span>
                Admin Panel
              </span>
              {adminOpen
                ? <ChevronDown size={13} className="shrink-0" />
                : <ChevronRight size={13} className="shrink-0" />
              }
            </button>

            {adminOpen && (
              <div className="bg-gray-50 border-l-2 border-green-100 ml-4">
                <NavLink to={ROUTES.ADMIN_USERS} className={linkClass}>
                  <span className="text-gray-400 text-xs">›</span>
                  Users
                </NavLink>
                <NavLink to={ROUTES.ADMIN_SETTINGS} className={linkClass}>
                  <span className="text-gray-400 text-xs">›</span>
                  Settings
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Footer: user + logout */}
      <div className="border-t border-gray-200 px-4 py-3 shrink-0">
        <p className="text-[12px] font-semibold text-gray-700 truncate mb-0.5">{user?.name}</p>
        <p className="text-[11px] text-gray-400 truncate mb-2">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
export const SidebarToggle: React.FC = () => null;
