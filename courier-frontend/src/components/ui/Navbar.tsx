import React from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { toggleSidebar } from '@/redux/slice/uiSlice';
import { useAuth } from '@/hooks/useAuth';
import { SidebarToggle } from './Sidebar';
import { User } from 'lucide-react';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-20">
      <SidebarToggle collapsed={collapsed} onToggle={() => dispatch(toggleSidebar())} />
      <h1 className="text-base font-semibold text-gray-900 flex-1">{title}</h1>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
          <User size={14} className="text-orange-600" />
        </div>
        <span className="font-medium">{user?.name}</span>
        {user?.role === 'admin' && (
          <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-medium">Admin</span>
        )}
      </div>
    </header>
  );
};

export default Navbar;
