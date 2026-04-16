import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAppDispatch } from '@/hooks/useRedux';
import { loginRequest, clearError } from '@/redux/slice/authSlice';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginRequest({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="login-email"
        label="Email address"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <Input
        id="login-password"
        label="Password"
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-orange-500 hover:text-orange-600 font-medium">
          Create account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
