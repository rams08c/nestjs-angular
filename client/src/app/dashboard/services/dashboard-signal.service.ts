import { Injectable, signal } from '@angular/core';
import {
  defaultDeleteConfirmState,
  defaultTransactionFormState,
  DeleteConfirmState,
  TransactionCategory,
  TransactionFormState,
  TransactionItem,
} from '../transaction.model';

export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface SpendingDataPoint {
  date: string;
  amount: number;
}

export interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
}

export interface TopCategory {
  category: string;
  amount: number;
  percentage: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardSignalService {
  readonly summary = signal<FinancialSummary>({
    totalBalance: 12450.00,
    monthlyIncome: 5000.00,
    monthlyExpenses: 2340.75,
  });

  readonly spendingTrend = signal<SpendingDataPoint[]>(this.generateSpendingTrend());

  readonly recentTransactions = signal<TransactionItem[]>([]);
  readonly categories = signal<TransactionCategory[]>([]);

  readonly loadingTransactions = signal(false);
  readonly loadingCategories = signal(false);
  readonly formState = signal<TransactionFormState>({ ...defaultTransactionFormState });
  readonly deleteState = signal<DeleteConfirmState>({ ...defaultDeleteConfirmState });

  readonly budgetProgress = signal<BudgetCategory[]>([
    { category: 'Food & Dining', allocated: 500, spent: 320 },
    { category: 'Transport', allocated: 200, spent: 42 },
    { category: 'Entertainment', allocated: 150, spent: 35 },
    { category: 'Utilities', allocated: 250, spent: 120 },
    { category: 'Shopping', allocated: 300, spent: 200 },
  ]);

  readonly topCategories = signal<TopCategory[]>([
    { category: 'Food & Dining', amount: 320, percentage: 38 },
    { category: 'Shopping', amount: 200, percentage: 24 },
    { category: 'Utilities', amount: 120, percentage: 14 },
    { category: 'Transport', amount: 42, percentage: 5 },
  ]);

  private generateSpendingTrend(): SpendingDataPoint[] {
    const data: SpendingDataPoint[] = [];
    const base = new Date(2026, 2, 1);
    const amounts = [45, 80, 30, 95, 60, 110, 50, 75, 40, 90,
                     65, 85, 55, 100, 45, 70, 88, 35, 92, 60,
                     75, 48, 83, 67, 55, 90, 40, 72, 85, 60];
    for (let i = 0; i < 30; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      data.push({
        date: d.toISOString().slice(0, 10),
        amount: amounts[i],
      });
    }
    return data;
  }

  setFormState(state: TransactionFormState): void {
    this.formState.set(state);
  }

  setDeleteState(state: DeleteConfirmState): void {
    this.deleteState.set(state);
  }

  setTransactions(transactions: TransactionItem[]): void {
    this.recentTransactions.set(transactions);
  }

  setCategories(categories: TransactionCategory[]): void {
    this.categories.set(categories);
  }

  setLoadingTransactions(isLoading: boolean): void {
    this.loadingTransactions.set(isLoading);
  }

  setLoadingCategories(isLoading: boolean): void {
    this.loadingCategories.set(isLoading);
  }

  addTransaction(transaction: TransactionItem): void {
    this.recentTransactions.update((transactions) => [transaction, ...transactions]);
  }

  updateTransaction(transactionId: string, updates: Partial<TransactionItem>): void {
    this.recentTransactions.update((transactions) =>
      transactions.map((tx) => (tx.id === transactionId ? { ...tx, ...updates } : tx)),
    );
  }

  removeTransaction(transactionId: string): void {
    this.recentTransactions.update((transactions) =>
      transactions.filter((tx) => tx.id !== transactionId),
    );
  }
}
