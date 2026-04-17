import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  phone?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    fetchMeRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMeSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
      state.initialized = true;
    },
    fetchMeFailure(state, _action: PayloadAction<string>) {
      state.user = null;
      state.loading = false;
      state.initialized = true;
      // intentionally NOT setting state.error — a 401 on page load just means no active session
    },

    loginRequest(state, _action: PayloadAction<{ email: string; password: string }>) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    signupRequest(state, _action: PayloadAction<{ name: string; email: string; password: string }>) {
      state.loading = true;
      state.error = null;
    },
    signupSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    signupFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    logoutFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchMeRequest,
  fetchMeSuccess,
  fetchMeFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
