import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import type { User } from '@/redux/slice/authSlice';

export const usersService = {
  async getUsers(): Promise<User[]> {
    const res = await axiosInstance.get(API.USERS.LIST);
    return res.data?.data ?? [];
  },

  async createUser(payload: { name: string; email: string; password: string; role: string }): Promise<User> {
    const res = await axiosInstance.post(API.USERS.CREATE, payload);
    return res.data?.data;
  },

  async deactivateUser(id: string): Promise<User> {
    const res = await axiosInstance.patch(API.USERS.DEACTIVATE(id));
    return res.data?.data;
  },
};
