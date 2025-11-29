import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './slices/usersSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    users: usersSlice,
    ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;