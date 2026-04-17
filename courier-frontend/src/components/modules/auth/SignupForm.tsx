import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAppDispatch } from '@/hooks/useRedux';
import { signupRequest, clearError } from '@/redux/slice/authSlice';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const SignupForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(signupRequest({ name, email, password }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="signup-name"
        label="Full name"
        type="text"
        required
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your full name"
      />
      <Input
        id="signup-email"
        label="Email address"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <Input
        id="signup-password"
        label="Password"
        type="password"
        required
        autoComplete="new-password"
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 8 characters"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-[#00684A] hover:text-[#00ED64] font-bold transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
