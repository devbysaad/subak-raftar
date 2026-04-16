import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import ProtectedRoute from './ProtectedRoute';

import Login from '@/page/Auth/Login';
import Signup from '@/page/Auth/Signup';
import Onboarding from '@/page/Onboarding/Onboarding';
import Dashboard from '@/page/Dashboard/Dashboard';
import DashboardHome from '@/page/Dashboard/DashboardHome';
import ShipmentList from '@/page/Shipments/ShipmentList';
import ShipmentCreate from '@/page/Shipments/ShipmentCreate';
import ShipmentDetail from '@/page/Shipments/ShipmentDetail';
import AdminDashboard from '@/page/Admin/AdminDashboard';

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public */}
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.SIGNUP} element={<Signup />} />
    <Route path={ROUTES.ONBOARDING} element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

    {/* Dashboard — nested routes rendered inside <Outlet /> in Dashboard layout */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    >
      <Route index element={<DashboardHome />} />
      <Route path="shipments" element={<ShipmentList />} />
      <Route path="shipments/create" element={<ShipmentCreate />} />
      <Route path="shipments/:id" element={<ShipmentDetail />} />
      <Route
        path="admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Catch-all → login */}
    <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
  </Routes>
);

export default AppRoutes;
