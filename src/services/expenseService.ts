import { apiService } from './api';
import { Expense, ExpenseCategory, PaginatedResponse, ApiResponse } from '../utils/types';

export interface CreateExpenseRequest {
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string; // ISO date string
  receiptFile?: File;
}

export interface UpdateExpenseRequest {
  amount?: number;
  currency?: string;
  category?: string;
  description?: string;
  date?: string; // ISO date string
  receiptFile?: File;
}

export interface ExpenseFilters {
  status?: 'pending' | 'approved' | 'rejected';
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: string;
}

export interface ExpenseListParams extends ExpenseFilters {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class ExpenseService {
  async getExpenses(params: ExpenseListParams = {}): Promise<PaginatedResponse<Expense>> {
    const response = await apiService.get<PaginatedResponse<Expense>>('/expenses', params);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch expenses');
  }

  async getExpenseById(id: string): Promise<Expense> {
    const response = await apiService.get<Expense>(`/expenses/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch expense');
  }

  async createExpense(expenseData: CreateExpenseRequest): Promise<Expense> {
    let formData: FormData | CreateExpenseRequest = expenseData;

    // If there's a receipt file, use FormData
    if (expenseData.receiptFile) {
      formData = new FormData();
      Object.entries(expenseData).forEach(([key, value]) => {
        if (value !== undefined) {
          (formData as FormData).append(key, value);
        }
      });
    }

    const response = await apiService.post<Expense>('/expenses', formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create expense');
  }

  async updateExpense(id: string, updates: UpdateExpenseRequest): Promise<Expense> {
    let formData: FormData | UpdateExpenseRequest = updates;

    // If there's a receipt file, use FormData
    if (updates.receiptFile) {
      formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          (formData as FormData).append(key, value);
        }
      });
    }

    const response = await apiService.put<Expense>(`/expenses/${id}`, formData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update expense');
  }

  async deleteExpense(id: string): Promise<void> {
    const response = await apiService.delete(`/expenses/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete expense');
    }
  }

  async approveExpense(id: string, comment?: string): Promise<Expense> {
    const response = await apiService.post<Expense>(`/expenses/${id}/approve`, { comment });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to approve expense');
  }

  async rejectExpense(id: string, reason: string): Promise<Expense> {
    const response = await apiService.post<Expense>(`/expenses/${id}/reject`, { reason });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to reject expense');
  }

  async getCategories(): Promise<ExpenseCategory[]> {
    const response = await apiService.get<ExpenseCategory[]>('/expenses/categories');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch categories');
  }

  async uploadReceipt(expenseId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await apiService.post<{ url: string }>(`/expenses/${expenseId}/receipt`, formData);
    
    if (response.success && response.data) {
      return response.data.url;
    }
    
    throw new Error(response.message || 'Failed to upload receipt');
  }

  async downloadReceipt(expenseId: string): Promise<Blob> {
    try {
      // This would typically return a blob for download
      const response = await fetch(`/api/expenses/${expenseId}/receipt/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download receipt');
      }

      return await response.blob();
    } catch (error) {
      throw new Error('Failed to download receipt');
    }
  }

  async getExpenseStats(filters: ExpenseFilters = {}): Promise<{
    totalAmount: number;
    totalExpenses: number;
    pendingAmount: number;
    approvedAmount: number;
    rejectedAmount: number;
  }> {
    const response = await apiService.get<{
      totalAmount: number;
      totalExpenses: number;
      pendingAmount: number;
      approvedAmount: number;
      rejectedAmount: number;
    }>('/expenses/stats', filters);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch expense statistics');
  }
}

export const expenseService = new ExpenseService();