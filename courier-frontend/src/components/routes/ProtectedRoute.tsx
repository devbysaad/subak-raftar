import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, initialized } = useAuth();

  // Still loading session — show spinner
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="spinner spinner-orange" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  // Not logged in → login page
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Admin-only route but user is employee → bounce to dashboard
  if (adminOnly && !isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
