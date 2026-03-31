import { Component, ChangeDetectionStrategy, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecentTransactions } from './components/recent-transactions/recent-transactions';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { DeleteConfirm } from './components/delete-confirm/delete-confirm';
import { RightPanel } from './components/right-panel/right-panel';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../app.constant';
import { DataFlowService } from '../shared-services/data-flow.service';

interface BudgetItem {
  category: string;
  spent: number;
  allocated: number;
}

interface TopCategory {
  category: string;
  amount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RecentTransactions,
    TransactionForm,
    DeleteConfirm,
    RightPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private dataFlowService = inject(DataFlowService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly isAuthenticated = computed(() => this.dataFlowService.isAuthenticated());
  readonly loadError = signal<string>('');

  // Filter signals
  readonly searchQuery = signal('');
  readonly categoryFilter = signal<string>('all');
  readonly statusFilter = signal<'all' | 'completed' | 'pending'>('all');
  readonly transactions = this.dataFlowService.transactionsForCurrentUser;

  // Summary computed signals
  readonly summary = computed(() => {
    const transactions = this.transactions();
    const totalBalance = transactions.reduce((sum, tx) => {
      return sum + (tx.type === 'income' ? (tx.amount || 0) : -(tx.amount || 0));
    }, 0);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const monthlyExpenses = monthlyTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    return { totalBalance, monthlyIncome, monthlyExpenses };
  });

  readonly expensesTotal = computed(() => {
    const transactions = this.transactions();
    return transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  });

  readonly topExpenseCategory = computed<TopCategory | null>(() => {
    const transactions = this.transactions();
    const categoryMap = new Map<string, number>();

    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        const category = tx.categoryName ?? tx.categoryId;
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + (tx.amount || 0));
      });

    let topCategory: TopCategory | null = null;
    let maxAmount = 0;

    categoryMap.forEach((amount, category) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategory = { category, amount };
      }
    });

    return topCategory;
  });

  readonly averageMonthlySpending = computed(() => {
    const transactions = this.transactions();
    const expenseTransactions = transactions.filter((tx) => tx.type === 'expense');
    
    if (expenseTransactions.length === 0) return 0;

    const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    return totalExpenses / 12; // Average over 12 months approximation
  });

  readonly budgetProgress = computed<BudgetItem[]>(() => {
    const transactions = this.transactions();
    const categoryMap = new Map<string, number>();

    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        const category = tx.categoryName ?? tx.categoryId;
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + (tx.amount || 0));
      });

    const budgets: BudgetItem[] = [];
    const allocations: Record<string, number> = {
      'Food & Dining': 500,
      'Transport': 300,
      'Entertainment': 200,
      'Utilities': 400,
      'Shopping': 600,
    };

    categoryMap.forEach((spent, category) => {
      budgets.push({
        category,
        spent: Math.round(spent),
        allocated: allocations[category] || 500,
      });
    });

    return budgets.sort((a, b) => b.spent - a.spent).slice(0, 5);
  });

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.dataFlowService.loadTransactionData().subscribe({
      error: () => {
        this.loadError.set(APP_ERROR_MESSAGES.TRANSACTION.LOAD_FAILED);
      },
    });
  }

  openAddTransaction(): void {
    this.dataFlowService.openAddDrawer();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onCategoryFilterChange(category: string): void {
    this.categoryFilter.set(category);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.categoryFilter.set('all');
    this.statusFilter.set('all');
  }
}
