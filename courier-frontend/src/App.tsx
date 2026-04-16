import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import AppRoutes from '@/components/routes/routes';
import { useAppDispatch } from '@/hooks/useRedux';
import { fetchMeRequest } from '@/redux/slice/authSlice';

/** Dispatches session restore on mount, inside the Redux Provider */
const AppInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMeRequest());
  }, [dispatch]);

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppInit>
          <AppRoutes />
        </AppInit>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
