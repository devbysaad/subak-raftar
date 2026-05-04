import axiosInstance from '@/lib/axios';
import { API } from '@/constants/api';
import type { ComplaintFilters } from '@/redux/slice/complaintsSlice';

export const complaintsService = {
  async getComplaints(filters: ComplaintFilters) {
    const params: Record<string, string | number> = {};
    if (filters.parcelNo) params.parcelNo = filters.parcelNo;
    if (filters.rStatus)  params.rStatus  = filters.rStatus;
    if (filters.cStatus)  params.cStatus  = filters.cStatus;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate)   params.toDate   = filters.toDate;
    if (filters.page)     params.page     = filters.page;
    if (filters.limit)    params.limit    = filters.limit;

    const res = await axiosInstance.get(API.COMPLAINTS.LIST, { params });
    return res.data;
  },

  async createComplaint(payload: { parcelNo: string; status: string; remarks: string }) {
    const res = await axiosInstance.post(API.COMPLAINTS.CREATE, payload);
    return res.data;
  },
};
