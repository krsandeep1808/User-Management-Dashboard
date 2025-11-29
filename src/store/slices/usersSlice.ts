import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, FilterState, Pagination, UserActivity } from '../../types';

interface UsersState {
  list: User[];
  filters: FilterState;
  pagination: Pagination;
  selectedUser: User | null;
  userActivities: Record<string, UserActivity[]>;
  loading: boolean;
}

const initialState: UsersState = {
  list: [],
  filters: {
    search: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  selectedUser: null,
  userActivities: {},
  loading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.list = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<Pagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setUserActivities: (state, action: PayloadAction<{ userId: string; activities: UserActivity[] }>) => {
      state.userActivities[action.payload.userId] = action.payload.activities;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User> & { id: string }>) => {
      const index = state.list.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = { ...state.selectedUser, ...action.payload };
      }
    },
  },
});

export const {
  setUsers,
  setFilters,
  setPagination,
  setSelectedUser,
  setUserActivities,
  setLoading,
  updateUser,
} = usersSlice.actions;

export default usersSlice.reducer;