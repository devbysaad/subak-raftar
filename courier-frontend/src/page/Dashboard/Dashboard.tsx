import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/ui/Sidebar';
import Navbar from '@/components/ui/Navbar';
import { useAppSelector } from '@/hooks/useRedux';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/shipments': 'Shipments',
  '/dashboard/shipments/create': 'Create Shipment',
  '/dashboard/admin': 'Admin Panel',
};

function getTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/dashboard/shipments/') && pathname !== '/dashboard/shipments/create') {
    return 'Shipment Detail';
  }
  return 'Dashboard';
}

const Dashboard: React.FC = () => {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-200"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <Navbar title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
