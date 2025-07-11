import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Configuration for Mauro Data Mapper API
const API_BASE_URL = process.env.NEXT_PUBLIC_MDM_API_URL || 'https://catalogo-metadados-pdun.dev.ic.ama.lan/api';
// Create axios instance with default configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('mdm_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('mdm_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



// Types for API responses
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    emailAddress: string;
    firstName?: string;
    lastName?: string;
    pending: boolean;
    disabled: boolean;
    createdBy: string;
  };
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  data: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubmissionRequest {
  title: string;
  description: string;
  data: Record<string, unknown>;
}

// Authentication API
export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/authentication/login', { username, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/authentication/logout');
    localStorage.removeItem('mdm_token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Submissions API
export const submissionsAPI = {
  // Get recent submissions
  getRecent: async (limit: number = 10): Promise<Submission[]> => {
    const response = await api.get(`/submissions/recent?limit=${limit}`);
    return response.data;
  },

  // Create new submission
  create: async (submission: CreateSubmissionRequest): Promise<Submission> => {
    const response = await api.post('/submissions', submission);
    return response.data;
  },

  // Get submission by ID
  getById: async (id: string): Promise<Submission> => {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
  },

  // Update submission
  update: async (id: string, updates: Partial<CreateSubmissionRequest>): Promise<Submission> => {
    const response = await api.put(`/submissions/${id}`, updates);
    return response.data;
  },

  // Delete submission
  delete: async (id: string): Promise<void> => {
    await api.delete(`/submissions/${id}`);
  },
};

// Data models API (for form fields)
export const modelsAPI = {
  // Get available data models
  getAll: async () => {
    const response = await api.get('/dataModels');
    return response.data;
  },

  // Get specific data model
  getById: async (id: string) => {
    const response = await api.get(`/dataModels/${id}`);
    return response.data;
  },
};

export default api; 