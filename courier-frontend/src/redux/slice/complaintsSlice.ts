import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Complaint {
  _id: string;
  parcelNo: string;
  status: string;
  remarks: string;
  rStatus: string;
  cStatus: string;
  createdAt: string;
  createdBy: { name: string };
}

export interface ComplaintFilters {
  parcelNo?: string;
  rStatus?: string;
  cStatus?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

interface ComplaintsState {
  list: Complaint[];
  total: number;
  pages: number;
  loading: boolean;
  createLoading: boolean;
  createSuccess: boolean;
  error: string | null;
  createError: string | null;
}

const initialState: ComplaintsState = {
  list: [],
  total: 0,
  pages: 1,
  loading: false,
  createLoading: false,
  createSuccess: false,
  error: null,
  createError: null,
};

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    fetchComplaintsRequest(state, _action: PayloadAction<ComplaintFilters>) {
      state.loading = true;
      state.error = null;
    },
    fetchComplaintsSuccess(
      state,
      action: PayloadAction<{ items: Complaint[]; total: number; pages: number }>
    ) {
      state.list = action.payload.items;
      state.total = action.payload.total;
      state.pages = action.payload.pages;
      state.loading = false;
    },
    fetchComplaintsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    createComplaintRequest(state, _action: PayloadAction<{ parcelNo: string; status: string; remarks: string }>) {
      state.createLoading = true;
      state.createSuccess = false;
      state.createError = null;
    },
    createComplaintSuccess(state, action: PayloadAction<Complaint>) {
      state.createLoading = false;
      state.createSuccess = true;
      // optimistic prepend — will be replaced when fetchComplaintsRequest re-fetches
      state.list = [action.payload, ...state.list];
    },
    createComplaintFailure(state, action: PayloadAction<string>) {
      state.createLoading = false;
      state.createError = action.payload;
    },

    resetCreateSuccess(state) {
      state.createSuccess = false;
    },
  },
});

export const {
  fetchComplaintsRequest,
  fetchComplaintsSuccess,
  fetchComplaintsFailure,
  createComplaintRequest,
  createComplaintSuccess,
  createComplaintFailure,
  resetCreateSuccess,
} = complaintsSlice.actions;

export default complaintsSlice.reducer;
