import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, hasCompany, isAdmin, initialized } = useAuth();

  console.log('[ProtectedRoute] State:', { initialized, isAuthenticated, hasCompany, isAdmin, adminOnly });

  if (!initialized) {
    console.log('[ProtectedRoute] Not initialized yet — showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="spinner spinner-orange" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated → redirecting to /login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!hasCompany) {
    console.log('[ProtectedRoute] No company → redirecting to /onboarding');
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  if (adminOnly && !isAdmin) {
    console.log('[ProtectedRoute] Not admin → redirecting to /dashboard');
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  console.log('[ProtectedRoute] ✅ Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
