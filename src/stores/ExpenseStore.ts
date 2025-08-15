import { makeAutoObservable, runInAction } from 'mobx';
import { Expense, ExpenseCategory } from '../utils/types';

export class ExpenseStore {
  expenses: Expense[] = [];
  categories: ExpenseCategory[] = [];
  isLoading = false;
  error: string | null = null;
  selectedExpense: Expense | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadDefaultCategories();
  }

  private loadDefaultCategories() {
    this.categories = [
      {
        id: '1',
        name: 'Travel',
        description: 'Business travel expenses',
        maxAmount: 5000,
        requiresReceipt: true,
        isActive: true
      },
      {
        id: '2',
        name: 'Meals',
        description: 'Business meals and entertainment',
        maxAmount: 200,
        requiresReceipt: true,
        isActive: true
      },
      {
        id: '3',
        name: 'Office Supplies',
        description: 'Office supplies and equipment',
        maxAmount: 1000,
        requiresReceipt: true,
        isActive: true
      },
      {
        id: '4',
        name: 'Software',
        description: 'Software licenses and subscriptions',
        maxAmount: 2000,
        requiresReceipt: true,
        isActive: true
      }
    ];
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  setSelectedExpense(expense: Expense | null) {
    this.selectedExpense = expense;
  }

  async loadExpenses(userId?: string): Promise<void> {
    this.setLoading(true);
    this.setError(null);

    try {
      // TODO: Implement actual API call
      // For now, load mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockExpenses: Expense[] = [
        {
          id: '1',
          userId: userId || '1',
          amount: 150.00,
          currency: 'USD',
          category: 'Meals',
          description: 'Client dinner',
          date: new Date('2024-08-10'),
          status: 'pending',
          createdAt: new Date('2024-08-10'),
          updatedAt: new Date('2024-08-10')
        }
      ];

      runInAction(() => {
        this.expenses = mockExpenses;
        this.setLoading(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setError(error instanceof Error ? error.message : 'Failed to load expenses');
        this.setLoading(false);
      });
    }
  }

  async createExpense(expenseData: Omit<Expense, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);

    try {
      // TODO: Implement actual API call
      const newExpense: Expense = {
        ...expenseData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      runInAction(() => {
        this.expenses = [newExpense, ...this.expenses];
        this.setLoading(false);
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.setError(error instanceof Error ? error.message : 'Failed to create expense');
        this.setLoading(false);
      });
      return false;
    }
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);

    try {
      // TODO: Implement actual API call
      const expenseIndex = this.expenses.findIndex(exp => exp.id === id);
      
      if (expenseIndex === -1) {
        throw new Error('Expense not found');
      }

      runInAction(() => {
        this.expenses[expenseIndex] = {
          ...this.expenses[expenseIndex],
          ...updates,
          updatedAt: new Date()
        };
        this.setLoading(false);
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.setError(error instanceof Error ? error.message : 'Failed to update expense');
        this.setLoading(false);
      });
      return false;
    }
  }

  async deleteExpense(id: string): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);

    try {
      // TODO: Implement actual API call
      runInAction(() => {
        this.expenses = this.expenses.filter(exp => exp.id !== id);
        this.setLoading(false);
      });

      return true;
    } catch (error) {
      runInAction(() => {
        this.setError(error instanceof Error ? error.message : 'Failed to delete expense');
        this.setLoading(false);
      });
      return false;
    }
  }

  get pendingExpenses() {
    return this.expenses.filter(expense => expense.status === 'pending');
  }

  get approvedExpenses() {
    return this.expenses.filter(expense => expense.status === 'approved');
  }

  get rejectedExpenses() {
    return this.expenses.filter(expense => expense.status === 'rejected');
  }

  get totalExpenseAmount() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  clearError() {
    this.setError(null);
  }
}