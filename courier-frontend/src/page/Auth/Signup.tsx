import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import SignupForm from '@/components/modules/auth/SignupForm';
import { Truck } from 'lucide-react';

const Signup: React.FC = () => {
  const { isAuthenticated, hasCompany } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(hasCompany ? ROUTES.DASHBOARD : ROUTES.ONBOARDING, { replace: true });
    }
  }, [isAuthenticated, hasCompany, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
            <Truck className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Subak Raftar</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
