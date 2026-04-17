import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import SignupForm from '@/components/modules/auth/SignupForm';
import { Truck } from 'lucide-react';

const Signup: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#F9FBFA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-[#00ED64] rounded-xl flex items-center justify-center mb-4 shadow-[0_4px_14px_rgba(0,237,100,0.3)]">
            <Truck className="text-[#001E2B]" size={28} />
          </div>
          <h1 className="text-2xl font-bold atlas-text-primary tracking-tight">Subak Raftar</h1>
          <p className="text-sm font-medium atlas-text-secondary mt-1">Register an employee account</p>
        </div>

        <div className="atlas-card p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
