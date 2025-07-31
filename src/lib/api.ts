import axios, { AxiosResponse, AxiosError } from 'axios';

// Configuration for Mauro Data Mapper API
const API_BASE_URL = '/api/mdm';
// Create axios instance with default configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is crucial for sending cookies with requests
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login on 401
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
// Types for API responses
export interface LoginResponse {
  id: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  pending: boolean;
  disabled: boolean;
  createdBy: string;
};




// Authentication API
export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/authentication/login', { username, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/authentication/logout');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Data models API (for form fields)
export const modelsAPI = {
  // Get available data models
  getAll: async () => {
    const response = await api.get('/dataModels');
    return response.data;
  },

  // Get data models from a specific folder
  getFromFolder: async (folderId: string) => {
    const response = await api.get(`/folders/${folderId}/dataModels`);
    return response.data;
  },

  // Get specific data model
  getById: async (id: string) => {
    const response = await api.get(`/dataModels/${id}`);
    return response.data;
  },

  createDataModel: async (folderId: string, data: { label: string; description: string; author: string; organisation: string; type:string}) => {
    const response = await api.post(`/folders/${folderId}/dataModels`, data);
    return response.data;
  },

  listDataModels: async (folderId: string) => {
    const response = await api.get(`/folders/${folderId}/dataModels`);
    return response.data;
  },

  listDataClasses: async (modelId: string) => {
    const response = await api.get(`/dataModels/${modelId}/allDataClasses`);
    return response.data;
  },

  

  createDataClass: async (modelId: string, data: { label: string; description: string; minMultiplicity: number; maxMultiplicity: number }) => {
    const response = await api.post(`/dataModels/${modelId}/dataClasses`, data);
    return response.data;
  },

  addDataTypeToModel: async (dataModelId: string, otherModelId: string, dataTypeId: string) => {
    const response = await api.post(`/dataModels/${dataModelId}/dataTypes/${otherModelId}/${dataTypeId}`, {});
    return response.data;
  },

  createDataElement: async (modelId: string, dataClassId: string, data: { label: string; maxMultiplicity: string; minMultiplicity: string; dataType: string; description: string; }) => {
    const response = await api.post(`/dataModels/${modelId}/dataClasses/${dataClassId}/dataElements`, data);
    return response.data;
  },

  getDataTypesFromModel: async (modelId: string) => {
    const response = await api.get(`/dataModels/${modelId}/dataTypes`);
    return response.data;
  },

  createChildDataClass: async (modelId: string, parentDataClassId: string, data: { label: string; description: string; minMultiplicity: number; maxMultiplicity: number }) => {
    const body = {
      ...data,
      domainType: 'DataClass',
    };
    const response = await api.post(`/dataModels/${modelId}/dataClasses/${parentDataClassId}/dataClasses`, body);
    return response.data;
  },
};

export default api; 