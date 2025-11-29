import axios from 'axios';
import { User, UserActivity, AnalyticsData } from '../types';

const API_BASE = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
});

export const userAPI = {
  getUsers: (): Promise<{ data: User[] }> => api.get('/users'),
  getUser: (id: string): Promise<{ data: User }> => api.get(`/users/${id}`),
  updateUser: (id: string, data: Partial<User>): Promise<{ data: User }> => 
    api.patch(`/users/${id}`, data),
};

export const analyticsAPI = {
  getAnalytics: (): Promise<{ data: AnalyticsData }> => api.get('/analytics'),
};

export const activitiesAPI = {
  getUserActivities: (userId: string): Promise<{ data: UserActivity[] }> => 
    api.get(`/userActivities/${userId}`),
};

export default api;