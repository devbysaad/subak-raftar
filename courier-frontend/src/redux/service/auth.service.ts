import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';

export const authService = {
  /**
   * Calls better-auth's signup endpoint directly via Axios.
   * better-auth exposes a standard REST endpoint — no authClient needed.
   */
  async signup(payload: { name: string; email: string; password: string }) {
    console.log('[AuthService] signup → POST', API.AUTH.SIGN_UP);
    const res = await axiosInstance.post(API.AUTH.SIGN_UP, payload);
    console.log('[AuthService] signup ✅', res.data);
    return res.data;
  },

  /**
   * Calls better-auth's sign-in endpoint directly via Axios.
   */
  async login(payload: { email: string; password: string }) {
    console.log('[AuthService] login → POST', API.AUTH.SIGN_IN, { email: payload.email });
    const res = await axiosInstance.post(API.AUTH.SIGN_IN, payload);
    console.log('[AuthService] login ✅', res.data);
    return res.data;
  },

  async logout() {
    console.log('[AuthService] logout → POST', API.AUTH.SIGN_OUT);
    const res = await axiosInstance.post(API.AUTH.SIGN_OUT);
    console.log('[AuthService] logout ✅');
    return res.data;
  },

  async getMe() {
    console.log('[AuthService] getMe → GET', API.USERS.ME);
    const res = await axiosInstance.get(API.USERS.ME);
    // Backend wraps: { success, message, data: <user> } — extract the actual user
    const user = res.data?.data ?? res.data;
    console.log('[AuthService] getMe ✅', user);
    return user;
  },

  async createCompany(payload: { name: string; email: string; phone: string; address: string }) {
    console.log('[AuthService] createCompany → POST', API.COMPANIES.CREATE);
    const res = await axiosInstance.post(API.COMPANIES.CREATE, payload);
    const company = res.data?.data ?? res.data;
    console.log('[AuthService] createCompany ✅', company);
    return company;
  },
};
