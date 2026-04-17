import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'lucide-react';

// Navbar is no longer used (Dashboard.tsx has its own inline header)
// Kept here for backward compatibility but simplified

interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="h-[56px] bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-20">
      {title && <h1 className="text-base font-semibold text-gray-800 flex-1">{title}</h1>}
      <div className="ml-auto flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700 leading-tight">{user?.name}</span>
          <span className="text-[11px] uppercase text-gray-400 tracking-wider">{user?.role}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <User size={16} className="text-green-700" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
