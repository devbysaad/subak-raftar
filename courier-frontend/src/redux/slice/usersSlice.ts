import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from './authSlice';

interface UsersState {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = { list: [], loading: false, error: null };

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersRequest(state) {
      state.loading = true;
      state.error   = null;
    },
    fetchUsersSuccess(state, action: PayloadAction<User[]>) {
      state.list    = action.payload;
      state.loading = false;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error   = action.payload;
    },

    createUserRequest(state, _action: PayloadAction<{ name: string; email: string; password: string; role: string }>) {
      state.loading = true;
      state.error   = null;
    },
    createUserSuccess(state, action: PayloadAction<User>) {
      state.list.unshift(action.payload);
      state.loading = false;
    },
    createUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error   = action.payload;
    },

    deactivateUserRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
    },
    deactivateUserSuccess(state, action: PayloadAction<User>) {
      state.list    = state.list.map(u => u._id === action.payload._id ? action.payload : u);
      state.loading = false;
    },
    deactivateUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error   = action.payload;
    },

    clearUsersError(state) { state.error = null; },
  },
});

export const {
  fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure,
  createUserRequest, createUserSuccess, createUserFailure,
  deactivateUserRequest, deactivateUserSuccess, deactivateUserFailure,
  clearUsersError,
} = usersSlice.actions;

export default usersSlice.reducer;
