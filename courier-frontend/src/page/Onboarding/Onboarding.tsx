import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useRedux';
import { setCompanyId } from '@/redux/slice/authSlice';
import { authService } from '@/redux/service/auth.service';
import { ROUTES } from '@/constants/routes';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Truck, Building2 } from 'lucide-react';

const Onboarding: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const company = await authService.createCompany(form);
      dispatch(setCompanyId(company._id || company.id));
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
            <Truck className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Set up your company</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Complete your company profile to start managing shipments
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
            <Building2 size={16} className="text-orange-500" />
            <span className="text-sm font-semibold text-gray-700">Company Information</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="company-name"
              label="Company Name"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Your courier company name"
            />
            <Input
              id="company-email"
              label="Business Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="info@yourcompany.com"
            />
            <Input
              id="company-phone"
              label="Phone"
              required
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="03XX-XXXXXXX"
            />
            <Input
              id="company-address"
              label="Address"
              required
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Company street address"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Complete Setup
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
