import axios from 'axios';
import type { InsertApplication } from '@shared/schema';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for CORS with credentials
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const reportApi = {
  getReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  updateReportStatus: async (id: number, data: { status: string }) => {
    try {
      const response = await api.patch(`/reports/${id}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },

  addComment: async (id: number, data: { content: string }) => {
    try {
      const response = await api.post(`/reports/${id}/comments`, data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Public endpoints
  submitReport: async (data: any) => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  getReportStatus: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Admin endpoints
  getAllReports: async () => {
    const response = await api.get('/reports/admin/reports');
    return response.data;
  },

  getReportStats: async () => {
    const response = await api.get('/reports/admin/stats');
    return response.data;
  },
};

export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: { username: string; password: string; email: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const permissionApi = {
  submitRequest: async (data: any) => {
    const response = await api.post('/permissions', data);
    return response.data;
  },

  getAllRequests: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/permissions/${id}`, { status });
    return response.data;
  },
};

export const applicationApi = {
  submitApplication: async (data: InsertApplication) => {
    try {
      const response = await api.post('/applications', data);
      return response.data;
    } catch (error: any) {
      // Log the error for debugging
      console.error('Application submission error:', error.response || error);
      throw error;
    }
  },
  getApplications: async () => {
    const response = await api.get('/applications/admin');
  },
};

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 