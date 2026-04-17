import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import type { User } from '@/redux/slice/authSlice';

/**
 * After login, better-auth returns { user: { id, email, name, ... }, session }
 * Our DB returns { _id, email, name, role, isActive, ... }
 * We always prefer to get the full user from our /api/users/me endpoint
 * because only our DB has the `role` field.
 * extractUser is kept as a fast-path only if our DB user is embedded.
 */
function extractUser(data: Record<string, unknown>): User | null {
  // Try to find our enriched user object (has role + isActive)
  const u = (data?.data ?? data?.user) as Record<string, unknown> | undefined;
  if (!u) return null;

  const id = (u._id ?? u.id) as string | undefined;
  // If role is missing it's a raw better-auth user — don't use it, getMe will be called
  if (!id || !u.role) return null;

  return {
    _id:      id,
    name:     u.name as string,
    email:    u.email as string,
    role:     u.role as 'admin' | 'employee',
    isActive: (u.isActive as boolean) ?? true,
    phone:    u.phone as string | undefined,
  };
}

export const authService = {
  async signup(payload: { name: string; email: string; password: string }) {
    const res = await axiosInstance.post(API.AUTH.SIGN_UP, payload);
    return res.data;
  },

  async login(payload: { email: string; password: string }) {
    const res = await axiosInstance.post(API.AUTH.SIGN_IN, payload);
    return res.data;
  },

  async logout() {
    await axiosInstance.post(API.AUTH.SIGN_OUT);
  },

  async getMe(): Promise<User> {
    const res = await axiosInstance.get(API.USERS.ME);
    const user = res.data?.data ?? res.data;
    return user as User;
  },

  extractUser,
};
