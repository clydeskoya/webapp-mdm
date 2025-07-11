import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, LoginResponse } from './api';

interface User {
  id: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  pending: boolean;
  disabled: boolean;
  createdBy: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: Partial<User>) => void;
  clearError: () => void;
  
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response: LoginResponse = await authAPI.login(username, password);
          // For debugging: you can log the user object from the API response
          // console.log('User data from API during login:', response.user);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          // Store token in localStorage for API requests
          localStorage.setItem('mdm_token', response.token);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Erro ao iniciar sessão',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        localStorage.removeItem('mdm_token');
      },

      updateUser: (newUserData: Partial<User>) => {
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...newUserData } : null,
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 