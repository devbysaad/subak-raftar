import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import ProtectedRoute from './ProtectedRoute';

import Login          from '@/page/Auth/Login';
import Dashboard      from '@/page/Dashboard/Dashboard';
import DashboardHome  from '@/page/Dashboard/DashboardHome';
import BookParcel     from '@/page/Shipments/BookParcel';
import ShipmentList   from '@/page/Shipments/ShipmentList';
import ShipmentDetail from '@/page/Shipments/ShipmentDetail';
import InvoicesPage   from '@/page/Invoices/InvoicesPage';
import LoadSheetPage  from '@/page/LoadSheet/LoadSheetPage';
import ComplaintsPage from '@/page/Complaints/ComplaintsPage';
import CourierPerformance from '@/page/Analytics/CourierPerformance';
import UsersPage      from '@/page/Admin/UsersPage';
import AdminDashboard from '@/page/Admin/AdminDashboard';

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public */}
    <Route path={ROUTES.LOGIN} element={<Login />} />

    {/* Authenticated */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    >
      <Route index                element={<DashboardHome />} />
      <Route path="book-parcel"   element={<BookParcel />} />
      <Route path="shipments"     element={<ShipmentList />} />
      <Route path="shipments/:id" element={<ShipmentDetail />} />
      <Route path="invoices"      element={<InvoicesPage />} />
      <Route path="load-sheet"    element={<LoadSheetPage />} />
      <Route path="complaints"    element={<ComplaintsPage />} />
      <Route path="couriers"      element={<CourierPerformance />} />

      {/* Admin-only routes */}
      <Route
        path="admin"
        element={<ProtectedRoute adminOnly><Navigate to={ROUTES.ADMIN_USERS} replace /></ProtectedRoute>}
      />
      <Route
        path="admin/users"
        element={<ProtectedRoute adminOnly><UsersPage /></ProtectedRoute>}
      />
      <Route
        path="admin/settings"
        element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}
      />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
  </Routes>
);

export default AppRoutes;
