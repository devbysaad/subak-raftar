import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useRedux';
import { logoutRequest } from '@/redux/slice/authSlice';
import { useAppSelector } from '@/hooks/useRedux';
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  LogOut,
  Truck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: ROUTES.DASHBOARD,
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Shipments',
    to: ROUTES.SHIPMENTS,
    icon: <Package size={18} />,
  },
  {
    label: 'Admin',
    to: ROUTES.ADMIN,
    icon: <ShieldCheck size={18} />,
    adminOnly: true,
  },
];

const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  const handleLogout = () => {
    dispatch(logoutRequest());
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200
        flex flex-col z-30 transition-all duration-200
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`h-14 flex items-center border-b border-gray-200 ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        {collapsed ? (
          <Truck className="text-orange-500" size={22} />
        ) : (
          <div className="flex items-center gap-2">
            <Truck className="text-orange-500" size={22} />
            <span className="font-semibold text-gray-900 text-base tracking-tight">Subak Raftar</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.DASHBOARD}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm font-medium transition-colors duration-150 mb-0.5
                ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border-l-2 border-orange-500 pl-[14px]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
                ${collapsed ? 'justify-center px-0 mx-0 pl-0 border-l-0' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`border-t border-gray-200 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3 text-sm text-gray-500 hover:text-red-500
            hover:bg-red-50 rounded-md py-2 transition-colors duration-150 w-full
            ${collapsed ? 'justify-center px-2' : 'px-3'}
          `}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

// Collapse toggle button (rendered outside sidebar, by Dashboard layout)
export const SidebarToggle: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({
  collapsed,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
    aria-label="Toggle sidebar"
  >
    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
  </button>
);

export default Sidebar;
