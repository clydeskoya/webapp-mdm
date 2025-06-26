import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Configuration for Mauro Data Mapper API
const API_BASE_URL = process.env.NEXT_PUBLIC_MDM_API_URL || 'http://localhost:8080/api';
const API_VERSION = 'v1';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
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

// Mock data for development
const mockSubmissions: Submission[] = [
  {
    id: '1',
    title: 'Dados de Clientes - Janeiro 2024',
    description: 'Submissão de dados de clientes para o mês de janeiro de 2024',
    data: { type: 'json', content: '{"clientes": 150}', priority: 'high' },
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  },
  {
    id: '2',
    title: 'Relatório de Vendas - Q4 2023',
    description: 'Relatório trimestral de vendas do último trimestre de 2023',
    data: { type: 'csv', content: 'vendas,q4,2023', priority: 'medium' },
    status: 'pending',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
  },
  {
    id: '3',
    title: 'Configuração de Sistema',
    description: 'Configurações do sistema de gestão de dados',
    data: { type: 'xml', content: '<config>...</config>', priority: 'low' },
    status: 'rejected',
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-06T11:30:00Z',
  },
  {
    id: '4',
    title: 'Backup de Base de Dados',
    description: 'Backup completo da base de dados principal',
    data: { type: 'binary', content: 'binary_data', priority: 'high' },
    status: 'approved',
    createdAt: '2024-01-03T02:00:00Z',
    updatedAt: '2024-01-03T02:15:00Z',
  },
  {
    id: '5',
    title: 'Dados de Inventário',
    description: 'Atualização do inventário de produtos',
    data: { type: 'json', content: '{"produtos": 500}', priority: 'medium' },
    status: 'pending',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
  },
];

// Types for API responses
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  data: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubmissionRequest {
  title: string;
  description: string;
  data: any;
}

// Authentication API
export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
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
    // Development mode - return mock data
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSubmissions.slice(0, limit);
    }

    const response = await api.get(`/submissions/recent?limit=${limit}`);
    return response.data;
  },

  // Create new submission
  create: async (submission: CreateSubmissionRequest): Promise<Submission> => {
    // Development mode - return mock response
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSubmission: Submission = {
        id: Date.now().toString(),
        title: submission.title,
        description: submission.description,
        data: submission.data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to mock data
      mockSubmissions.unshift(newSubmission);
      
      return newSubmission;
    }

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