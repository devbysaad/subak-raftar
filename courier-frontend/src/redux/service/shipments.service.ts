import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import type { ShipmentFilters, ShipmentStatus } from '@/redux/slice/shipmentsSlice';

export const shipmentsService = {
  async getShipments(filters: Partial<ShipmentFilters>) {
    const params: Record<string, string | number> = {};
    if (filters.status) params.status = filters.status;
    if (filters.provider) params.provider = filters.provider;
    if (filters.isCOD !== undefined && filters.isCOD !== '') params.isCOD = filters.isCOD;
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const res = await axiosInstance.get(API.SHIPMENTS.LIST, { params });
    return res.data;
  },

  async getShipment(id: string) {
    const res = await axiosInstance.get(API.SHIPMENTS.DETAIL(id));
    return res.data;
  },

  async createShipment(payload: Record<string, unknown>) {
    const res = await axiosInstance.post(API.SHIPMENTS.CREATE, payload);
    return res.data;
  },

  async getShipmentHistory(id: string) {
    const res = await axiosInstance.get(API.SHIPMENTS.HISTORY(id));
    return res.data;
  },

  async updateShipmentStatus(id: string, status: ShipmentStatus, note?: string) {
    const res = await axiosInstance.patch(API.SHIPMENTS.UPDATE_STATUS(id), { status, note });
    return res.data;
  },

  async cancelShipment(id: string) {
    const res = await axiosInstance.patch(API.SHIPMENTS.CANCEL(id));
    return res.data;
  },
};
