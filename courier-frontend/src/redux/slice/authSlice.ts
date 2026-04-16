import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  companyId: string | null;
  isActive: boolean;
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
      console.log('[AuthSlice] fetchMeRequest — loading session');
      state.loading = true;
      state.error = null;
    },
    fetchMeSuccess(state, action: PayloadAction<User>) {
      console.log('[AuthSlice] fetchMeSuccess — user:', action.payload);
      state.user = action.payload;
      state.loading = false;
      state.initialized = true;
    },
    fetchMeFailure(state, action: PayloadAction<string>) {
      console.warn('[AuthSlice] fetchMeFailure — no session:', action.payload);
      state.user = null;
      state.loading = false;
      state.error = action.payload;
      state.initialized = true;
    },

    loginRequest(state, action: PayloadAction<{ email: string; password: string }>) {
      console.log('[AuthSlice] loginRequest — email:', action.payload.email);
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      console.log('[AuthSlice] loginSuccess — user:', action.payload);
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      console.error('[AuthSlice] loginFailure — error:', action.payload);
      state.loading = false;
      state.error = action.payload;
    },

    signupRequest(state, action: PayloadAction<{ name: string; email: string; password: string }>) {
      console.log('[AuthSlice] signupRequest — email:', action.payload.email);
      state.loading = true;
      state.error = null;
    },
    signupSuccess(state, action: PayloadAction<User>) {
      console.log('[AuthSlice] signupSuccess — user:', action.payload);
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    signupFailure(state, action: PayloadAction<string>) {
      console.error('[AuthSlice] signupFailure — error:', action.payload);
      state.loading = false;
      state.error = action.payload;
    },

    logoutRequest(state) {
      console.log('[AuthSlice] logoutRequest');
      state.loading = true;
    },
    logoutSuccess(state) {
      console.log('[AuthSlice] logoutSuccess — user cleared');
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    logoutFailure(state, action: PayloadAction<string>) {
      console.error('[AuthSlice] logoutFailure:', action.payload);
      state.loading = false;
      state.error = action.payload;
    },

    setCompanyId(state, action: PayloadAction<string>) {
      console.log('[AuthSlice] setCompanyId:', action.payload);
      if (state.user) {
        state.user.companyId = action.payload;
      }
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
  setCompanyId,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
