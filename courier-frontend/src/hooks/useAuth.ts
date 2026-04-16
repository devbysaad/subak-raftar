import { useAppSelector } from './useRedux';

export const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  const initialized = useAppSelector((state) => state.auth.initialized);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;
  const hasCompany = !!user?.companyId;

  return { user, loading, error, initialized, isAdmin, isAuthenticated, hasCompany };
};
