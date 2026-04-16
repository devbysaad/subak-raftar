import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ShipmentStatus =
  | 'booked'
  | 'received'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export type Provider = 'tcs' | 'leopards' | 'trax' | 'mp' | 'self';

export interface Shipment {
  _id: string;
  companyId: string;
  createdBy: string;
  sender: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  receiver: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  weight: number;
  packageType: string;
  description: string;
  provider: Provider;
  providerTrackingNo: string;
  status: ShipmentStatus;
  isCOD: boolean;
  codAmount: number;
  codStatus: string;
  shopifyOrderId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Admin populated
  companyName?: string;
}

export interface ShipmentHistory {
  _id: string;
  shipmentId: string;
  status: ShipmentStatus;
  note: string;
  updatedBy: string;
  updatedByName?: string;
  createdAt: string;
}

export interface ShipmentFilters {
  status: string;
  provider: string;
  isCOD: string;
  search: string;
  page: number;
  limit: number;
}

interface ShipmentsState {
  list: Shipment[];
  total: number;
  current: Shipment | null;
  history: ShipmentHistory[];
  filters: ShipmentFilters;
  loading: boolean;
  loadingDetail: boolean;
  loadingCreate: boolean;
  loadingHistory: boolean;
  loadingAction: boolean;
  error: string | null;
  errorDetail: string | null;
  createError: string | null;
}

const initialState: ShipmentsState = {
  list: [],
  total: 0,
  current: null,
  history: [],
  filters: {
    status: '',
    provider: '',
    isCOD: '',
    search: '',
    page: 1,
    limit: 20,
  },
  loading: false,
  loadingDetail: false,
  loadingCreate: false,
  loadingHistory: false,
  loadingAction: false,
  error: null,
  errorDetail: null,
  createError: null,
};

const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    // Fetch list
    fetchShipmentsRequest(state, _action: PayloadAction<Partial<ShipmentFilters>>) {
      state.loading = true;
      state.error = null;
    },
    fetchShipmentsSuccess(state, action: PayloadAction<{ shipments: Shipment[]; total: number }>) {
      state.list = action.payload.shipments;
      state.total = action.payload.total;
      state.loading = false;
    },
    fetchShipmentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch detail
    fetchShipmentRequest(state, _action: PayloadAction<string>) {
      state.loadingDetail = true;
      state.errorDetail = null;
      state.current = null;
    },
    fetchShipmentSuccess(state, action: PayloadAction<Shipment>) {
      state.current = action.payload;
      state.loadingDetail = false;
    },
    fetchShipmentFailure(state, action: PayloadAction<string>) {
      state.loadingDetail = false;
      state.errorDetail = action.payload;
    },

    // Create shipment
    createShipmentRequest(state, _action: PayloadAction<Partial<Shipment>>) {
      state.loadingCreate = true;
      state.createError = null;
    },
    createShipmentSuccess(state, action: PayloadAction<Shipment>) {
      state.list.unshift(action.payload);
      state.loadingCreate = false;
    },
    createShipmentFailure(state, action: PayloadAction<string>) {
      state.loadingCreate = false;
      state.createError = action.payload;
    },

    // Fetch history
    fetchShipmentHistoryRequest(state, _action: PayloadAction<string>) {
      state.loadingHistory = true;
    },
    fetchShipmentHistorySuccess(state, action: PayloadAction<ShipmentHistory[]>) {
      state.history = action.payload;
      state.loadingHistory = false;
    },
    fetchShipmentHistoryFailure(state, _action: PayloadAction<string>) {
      state.loadingHistory = false;
    },

    // Update status (admin)
    updateShipmentStatusRequest(state, _action: PayloadAction<{ id: string; status: ShipmentStatus; note?: string }>) {
      state.loadingAction = true;
    },
    updateShipmentStatusSuccess(state, action: PayloadAction<Shipment>) {
      state.loadingAction = false;
      if (state.current?._id === action.payload._id) {
        state.current = action.payload;
      }
      state.list = state.list.map((s) => (s._id === action.payload._id ? action.payload : s));
    },
    updateShipmentStatusFailure(state, _action: PayloadAction<string>) {
      state.loadingAction = false;
    },

    // Cancel shipment
    cancelShipmentRequest(state, _action: PayloadAction<string>) {
      state.loadingAction = true;
    },
    cancelShipmentSuccess(state, action: PayloadAction<Shipment>) {
      state.loadingAction = false;
      if (state.current?._id === action.payload._id) {
        state.current = action.payload;
      }
      state.list = state.list.map((s) => (s._id === action.payload._id ? action.payload : s));
    },
    cancelShipmentFailure(state, _action: PayloadAction<string>) {
      state.loadingAction = false;
    },

    // Filters
    setFilters(state, action: PayloadAction<Partial<ShipmentFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },

    clearCreateError(state) {
      state.createError = null;
    },
  },
});

export const {
  fetchShipmentsRequest,
  fetchShipmentsSuccess,
  fetchShipmentsFailure,
  fetchShipmentRequest,
  fetchShipmentSuccess,
  fetchShipmentFailure,
  createShipmentRequest,
  createShipmentSuccess,
  createShipmentFailure,
  fetchShipmentHistoryRequest,
  fetchShipmentHistorySuccess,
  fetchShipmentHistoryFailure,
  updateShipmentStatusRequest,
  updateShipmentStatusSuccess,
  updateShipmentStatusFailure,
  cancelShipmentRequest,
  cancelShipmentSuccess,
  cancelShipmentFailure,
  setFilters,
  resetFilters,
  clearCreateError,
} = shipmentsSlice.actions;

export default shipmentsSlice.reducer;
