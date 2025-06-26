import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, LoginResponse } from './api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // Development mode - bypass authentication
  enableDevMode: () => void;
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
          // For development, bypass actual API call
          if (process.env.NODE_ENV === 'development') {
            // Simulate successful login
            set({
              user: {
                id: 'dev-user-1',
                username: username || 'dev-user',
                email: 'dev@example.com',
              },
              token: 'dev-token-123',
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            localStorage.setItem('mdm_token', 'dev-token-123');
            return;
          }

          const response: LoginResponse = await authAPI.login(username, password);
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

      clearError: () => {
        set({ error: null });
      },

      enableDevMode: () => {
        set({
          user: {
            id: 'dev-user-1',
            username: 'Utilizador de Desenvolvimento',
            email: 'dev@example.com',
          },
          token: 'dev-token-123',
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        localStorage.setItem('mdm_token', 'dev-token-123');
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