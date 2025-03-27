import axios from 'axios';

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
  // Public endpoints
  submitReport: async (reportData: any) => {
    const response = await api.post('/reports/submit-report', reportData);
    return response.data;
  },

  getReportStatus: async (reportId: string) => {
    const response = await api.get(`/reports/status/${reportId}`);
    return response.data;
  },

  // Admin endpoints
  getAllReports: async () => {
    const response = await api.get('/reports/admin/reports');
    return response.data;
  },

  updateReportStatus: async (reportId: string, updateData: any) => {
    const response = await api.patch(`/reports/admin/update-status/${reportId}`, updateData);
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
    const response = await api.post('/applications', data);
    return response.data;
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