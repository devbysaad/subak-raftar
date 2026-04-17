import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/ui/Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':              'Dashboard',
  '/dashboard/book-parcel':  'Book Parcel',
  '/dashboard/invoices':     'View Invoices',
  '/dashboard/load-sheet':   'Create Load Sheet',
  '/dashboard/complaints':   'Add Complain',
  '/dashboard/admin':        'Admin Panel',
  '/dashboard/admin/users':  'Admin Panel — Users',
  '/dashboard/admin/settings': 'Admin Panel — Settings',
};

const Dashboard: React.FC = () => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'Dashboard';

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 220 }}>
        {/* Top bar */}
        <header className="h-[56px] bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-20">
          <h1 className="text-base font-semibold text-gray-800">{title}</h1>
        </header>
        <main className="flex-1 p-5 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
