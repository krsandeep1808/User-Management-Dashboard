import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
}

const initialState: UIState = {
  darkMode: false,
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleDarkMode, toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;