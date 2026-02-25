import apiClient from './api';
import type { LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '../types';

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<any>(
      '/auth/login',
      credentials
    );
    // Backend returns { status: 'success', user: {...}, token: '...' }
    if (response.data.status === 'success' && response.data.user && response.data.token) {
      return {
        user: response.data.user,
        token: response.data.token,
      };
    }
    throw new Error(response.data.message || 'Login failed');
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<any>(
      '/auth/register',
      data
    );
    // Backend returns { status: 'success', user: {...}, token: '...' }
    if (response.data.status === 'success' && response.data.user && response.data.token) {
      return {
        user: response.data.user,
        token: response.data.token,
      };
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  // Verify token and get user
  verifyToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<ApiResponse<AuthResponse>>('/auth/verify');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Token verification failed');
  },

  // Logout (optional backend call)
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue even if backend logout fails
      console.error('Logout error:', error);
    }
  },
};
