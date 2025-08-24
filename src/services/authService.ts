import { apiService } from './api';
import { User, ApiResponse } from '../utils/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  department?: string;
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await apiService.post<User>('/auth/register', userData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('authToken');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get current user');
  }

  async refreshToken(): Promise<string> {
    const response = await apiService.post<{ token: string }>('/auth/refresh');
    
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      return response.data.token;
    }
    
    throw new Error(response.message || 'Token refresh failed');
  }

  async requestPasswordReset(email: string): Promise<void> {
    const response = await apiService.post('/auth/forgot-password', { email });
    
    if (!response.success) {
      throw new Error(response.message || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await apiService.post('/auth/reset-password', {
      token,
      password: newPassword
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Password reset failed');
    }
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return true;

    try {
      // Decode JWT token (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();