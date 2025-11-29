export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  avatar: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserActivity {
  id: number;
  action: string;
  timestamp: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface FilterState {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface AnalyticsData {
  signups: Array<{ date: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
}