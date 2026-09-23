import { createSlice } from "@reduxjs/toolkit";

export interface UiState {
  isMobileMenuOpen: boolean;
}

const initialState: UiState = {
  isMobileMenuOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
  },
});

export const { openMobileMenu, closeMobileMenu, toggleMobileMenu } =
  uiSlice.actions;

export default uiSlice.reducer;
