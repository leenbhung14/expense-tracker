import { makeAutoObservable } from 'mobx';
import { User } from '../utils/types';

export class AuthStore {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User | null) {
    this.user = user;
    this.isAuthenticated = !!user;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async login(email: string, password: string): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      // TODO: Implement actual login logic
      // For now, simulate a successful login
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'user',
        department: 'Engineering'
      };
      
      this.setUser(mockUser);
      this.setLoading(false);
      return true;
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Login failed');
      this.setLoading(false);
      return false;
    }
  }

  async logout(): Promise<void> {
    this.setLoading(true);
    
    try {
      // TODO: Implement actual logout logic
      this.setUser(null);
      this.setLoading(false);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Logout failed');
      this.setLoading(false);
    }
  }

  clearError() {
    this.setError(null);
  }
}