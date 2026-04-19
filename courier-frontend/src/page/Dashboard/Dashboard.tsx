import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/ui/Sidebar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 220 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
