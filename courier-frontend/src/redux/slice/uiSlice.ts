import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  modalOpen: boolean;
  modalType: string | null;
  modalData: unknown;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  modalOpen: false,
  modalType: null,
  modalData: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    openModal(state, action: PayloadAction<{ type: string; data?: unknown }>) {
      state.modalOpen = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data ?? null;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.modalType = null;
      state.modalData = null;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
