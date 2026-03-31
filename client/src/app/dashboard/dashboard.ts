import { Component, ChangeDetectionStrategy, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { RecentTransactions } from './components/recent-transactions/recent-transactions';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { DeleteConfirm } from './components/delete-confirm/delete-confirm';
import { RightPanel } from './components/right-panel/right-panel';
import { BudgetOverview } from './components/budget-overview/budget-overview';
import { GoalOverview } from './components/goal-overview/goal-overview';
import { BudgetForm } from './components/budget-form/budget-form';
import { GoalForm } from './components/goal-form/goal-form';
import { AccountPanel } from './components/account-panel/account-panel';
import { SettingsPanel } from './components/settings-panel/settings-panel';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../app.constant';
import { DataFlowService } from '../shared-services/data-flow.service';

interface TopCategory {
  category: string;
  amount: number;
}

interface CategoryBreakdown extends TopCategory {
  percentage: number;
}

type DashboardSection =
  | 'overview'
  | 'transactions'
  | 'budgets'
  | 'goals'
  | 'reports'
  | 'accounts'
  | 'settings';

interface NavItem {
  label: string;
  route: string;
  section: DashboardSection;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    RecentTransactions,
    TransactionForm,
    DeleteConfirm,
    RightPanel,
    BudgetOverview,
    GoalOverview,
    BudgetForm,
    GoalForm,
    AccountPanel,
    SettingsPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private dataFlowService = inject(DataFlowService);
  private route = inject(ActivatedRoute);

  readonly text = APP_TEXT.DASHBOARD;
  readonly isAuthenticated = computed(() => this.dataFlowService.isAuthenticated());
  readonly loadError = signal<string>('');
  readonly currencyCode = this.dataFlowService.currencyCode;
  readonly currencySymbol = this.dataFlowService.currencySymbol;
  private readonly routeSection = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('section'))),
    { initialValue: this.route.snapshot.paramMap.get('section') },
  );

  readonly navItems: readonly NavItem[] = [
    {
      label: this.text.NAV_DASHBOARD,
      route: '/dashboard/overview',
      section: 'overview',
      description: 'Combined view across transactions, budgets, and goals.',
    },
    {
      label: this.text.NAV_TRANSACTIONS,
      route: '/dashboard/transactions',
      section: 'transactions',
      description: 'Browse and manage all transaction activity.',
    },
    {
      label: this.text.NAV_BUDGETS,
      route: '/dashboard/budgets',
      section: 'budgets',
      description: 'Monitor category limits and current month usage.',
    },
    {
      label: this.text.NAV_GOALS,
      route: '/dashboard/goals',
      section: 'goals',
      description: 'Track savings goals and progress toward targets.',
    },
    {
      label: this.text.NAV_REPORTS,
      route: '/dashboard/reports',
      section: 'reports',
      description: 'See summary metrics and category breakdowns.',
    },
    {
      label: this.text.NAV_ACCOUNTS,
      route: '/dashboard/accounts',
      section: 'accounts',
      description: 'View connected account information and balances.',
    },
    {
      label: this.text.NAV_SETTINGS,
      route: '/dashboard/settings',
      section: 'settings',
      description: 'Manage preferences and profile settings.',
    },
  ];
  readonly section = computed<DashboardSection>(() => {
    const currentSection = this.routeSection();
    return this.navItems.some((item) => item.section === currentSection)
      ? (currentSection as DashboardSection)
      : 'overview';
  });
  readonly currentNavItem = computed(
    () => this.navItems.find((item) => item.section === this.section()) ?? this.navItems[0],
  );

  // Filter signals
  readonly searchQuery = signal('');
  readonly categoryFilter = signal<string>('all');
  readonly statusFilter = signal<'all' | 'completed' | 'pending'>('all');
  readonly transactions = this.dataFlowService.transactionsForCurrentUser;
  readonly budgets = this.dataFlowService.budgetsForCurrentUser;
  readonly goals = this.dataFlowService.goalsForCurrentUser;

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

  readonly totalGoalCount = computed(() => this.goals().length);
  readonly totalBudgetCount = computed(() => this.budgets().length);
  readonly totalBudgetedAmount = computed(() =>
    this.budgets().reduce((sum, budget) => sum + budget.limitAmount, 0),
  );
  readonly totalSavedAmount = computed(() =>
    this.goals().reduce((sum, goal) => sum + goal.savedAmount, 0),
  );
  readonly budgetAlertCount = computed(
    () => this.budgets().filter((budget) => budget.progressPercent >= 80).length,
  );
  readonly completedGoalsCount = computed(
    () => this.goals().filter((goal) => goal.progressPercent >= 100).length,
  );
  readonly reportCategoryBreakdown = computed<CategoryBreakdown[]>(() => {
    const expenseTransactions = this.transactions().filter((tx) => tx.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const categoryTotals = new Map<string, number>();

    expenseTransactions.forEach((transaction) => {
      const category = transaction.categoryName ?? transaction.categoryId;
      categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + (transaction.amount || 0));
    });

    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }))
      .sort((left, right) => right.amount - left.amount)
      .slice(0, 5);
  });
  readonly latestTransactions = computed(() => this.transactions().slice(0, 5));

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      return;
    }

    this.dataFlowService.loadDashboardData().subscribe({
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
