import { useAppSelector } from './useRedux';

export const useAuth = () => {
  const user    = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const error   = useAppSelector((state) => state.auth.error);
  const initialized = useAppSelector((state) => state.auth.initialized);

  const isAuthenticated = !!user;
  const isAdmin    = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';

  return { user, loading, error, initialized, isAuthenticated, isAdmin, isEmployee };
};
