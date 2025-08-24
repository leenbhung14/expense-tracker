import { AuthStore } from './AuthStore';
import { ExpenseStore } from './ExpenseStore';

export class RootStore {
  authStore: AuthStore;
  expenseStore: ExpenseStore;

  constructor() {
    this.authStore = new AuthStore();
    this.expenseStore = new ExpenseStore();
  }
}