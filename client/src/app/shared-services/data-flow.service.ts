import { Injectable, computed, inject } from '@angular/core';
import { finalize, forkJoin, Observable, tap } from 'rxjs';
import {
  BudgetFormModel,
  BudgetItem,
  defaultBudgetFormModel,
  defaultBudgetFormState,
  defaultGoalFormModel,
  defaultGoalFormState,
  GoalFormModel,
  GoalItem,
} from '../budget-goal/budget-goal.model';
import { BudgetApiService } from '../budget-goal/services/budget-api.service';
import { GoalApiService } from '../budget-goal/services/goal-api.service';
import { SignalService, User } from './signal.service';
import { DashboardSignalService } from '../dashboard/services/dashboard-signal.service';
import { TransactionApiService } from '../dashboard/services/transaction-api.service';
import {
  defaultDeleteConfirmState,
  defaultTransactionFormModel,
  defaultTransactionFormState,
  TransactionCategory,
  TransactionFormModel,
  TransactionItem,
} from '../dashboard/components/transaction-form/transaction.model';
import {
  AccountFormModel,
  AccountItem,
  defaultAccountFormModel,
  defaultAccountFormState,
} from '../account-settings/account.model';
import {
  defaultSettingsFormModel,
  defaultSettingsFormState,
  SettingsFormModel,
} from '../account-settings/settings.model';
import { AccountApiService } from '../account-settings/services/account-api.service';
import { SettingsApiService } from '../account-settings/services/settings-api.service';
import { CurrencyInfo, DEFAULT_CURRENCY, getCurrencyForCountry } from '../app.countries';

@Injectable({
  providedIn: 'root',
})
export class DataFlowService {
  private signalService = inject(SignalService);
  private dashboardSignalService = inject(DashboardSignalService);
  private transactionApiService = inject(TransactionApiService);
  private budgetApiService = inject(BudgetApiService);
  private goalApiService = inject(GoalApiService);
  private accountApiService = inject(AccountApiService);
  private settingsApiService = inject(SettingsApiService);

  get isLoggedIn() {
    return this.signalService.isLoggedIn;
  }

  get currentUser() {
    return this.signalService.currentUser;
  }

  get authToken() {
    return this.signalService.authToken;
  }

  get transactionFormState() {
    return this.dashboardSignalService.formState;
  }

  get deleteConfirmState() {
    return this.dashboardSignalService.deleteState;
  }

  get categories() {
    return this.dashboardSignalService.categories;
  }

  get loadingCategories() {
    return this.dashboardSignalService.loadingCategories;
  }

  get budgets() {
    return this.dashboardSignalService.budgets;
  }

  get goals() {
    return this.dashboardSignalService.goals;
  }

  get loadingBudgets() {
    return this.dashboardSignalService.loadingBudgets;
  }

  get loadingGoals() {
    return this.dashboardSignalService.loadingGoals;
  }

  get budgetFormState() {
    return this.dashboardSignalService.budgetFormState;
  }

  get goalFormState() {
    return this.dashboardSignalService.goalFormState;
  }

  get accounts() {
    return this.signalService.accounts;
  }

  get accountFormState() {
    return this.dashboardSignalService.accountFormState;
  }

  get settingsFormState() {
    return this.dashboardSignalService.settingsFormState;
  }

  get settings() {
    return this.signalService.settings;
  }

  readonly currency = computed<CurrencyInfo>(() => {
    const country = this.signalService.settings()?.country ?? '';
    return country ? getCurrencyForCountry(country) : DEFAULT_CURRENCY;
  });

  readonly currencyCode = computed(() => this.currency().code);
  readonly currencySymbol = computed(() => this.currency().symbol);
  readonly transactionsForCurrentUser = computed(() => {
    if (!this.isAuthenticated()) {
      return [];
    }

    return this.dashboardSignalService
      .recentTransactions()
      .map((transaction) => ({
        ...transaction,
        categoryName:
          this.dashboardSignalService
            .categories()
            .find((category) => category.id === transaction.categoryId)?.name ?? transaction.categoryId,
      }));
  });

  readonly budgetsForCurrentUser = computed(() => {
    if (!this.isAuthenticated()) {
      return [];
    }

    return this.dashboardSignalService.budgets().map((budget) => ({
      ...budget,
      categoryName:
        this.dashboardSignalService
          .categories()
          .find((category) => category.id === budget.categoryId)?.name ?? budget.categoryId,
    }));
  });

  readonly goalsForCurrentUser = computed(() => {
    if (!this.isAuthenticated()) {
      return [];
    }

    return this.dashboardSignalService.goals();
  });

  loginUser(user: User, token: string): void {
    this.signalService.setUser(user);
    this.signalService.setToken(token);
    this.signalService.setLoggedIn(true);
  }

  logoutUser(): void {
    this.signalService.clearAuth();
  }

  getToken(): string | null {
    return this.signalService.getToken();
  }

  isAuthenticated(): boolean {
    return this.signalService.isAuthenticated();
  }

  loadTransactionData(): Observable<{ transactions: TransactionItem[]; categories: TransactionCategory[] }> {
    this.dashboardSignalService.setLoadingTransactions(true);
    this.dashboardSignalService.setLoadingCategories(true);

    return forkJoin({
      transactions: this.transactionApiService.getTransactions(),
      categories: this.transactionApiService.getCategories(),
    }).pipe(
      tap(({ transactions, categories }) => {
        this.dashboardSignalService.setTransactions(transactions);
        this.dashboardSignalService.setCategories(categories);
      }),
      finalize(() => {
        this.dashboardSignalService.setLoadingTransactions(false);
        this.dashboardSignalService.setLoadingCategories(false);
      }),
    );
  }

  loadBudgetGoalData(): Observable<{ budgets: BudgetItem[]; goals: GoalItem[] }> {
    this.dashboardSignalService.setLoadingBudgets(true);
    this.dashboardSignalService.setLoadingGoals(true);

    return forkJoin({
      budgets: this.budgetApiService.getBudgets(),
      goals: this.goalApiService.getGoals(),
    }).pipe(
      tap(({ budgets, goals }) => {
        this.dashboardSignalService.setBudgets(budgets);
        this.dashboardSignalService.setGoals(goals);
      }),
      finalize(() => {
        this.dashboardSignalService.setLoadingBudgets(false);
        this.dashboardSignalService.setLoadingGoals(false);
      }),
    );
  }

  loadDashboardData(): Observable<{
    transactions: TransactionItem[];
    categories: TransactionCategory[];
    budgets: BudgetItem[];
    goals: GoalItem[];
  }> {
    this.dashboardSignalService.setLoadingTransactions(true);
    this.dashboardSignalService.setLoadingCategories(true);
    this.dashboardSignalService.setLoadingBudgets(true);
    this.dashboardSignalService.setLoadingGoals(true);

    return forkJoin({
      transactions: this.transactionApiService.getTransactions(),
      categories: this.transactionApiService.getCategories(),
      budgets: this.budgetApiService.getBudgets(),
      goals: this.goalApiService.getGoals(),
    }).pipe(
      tap(({ transactions, categories, budgets, goals }) => {
        this.dashboardSignalService.setTransactions(transactions);
        this.dashboardSignalService.setCategories(categories);
        this.dashboardSignalService.setBudgets(budgets);
        this.dashboardSignalService.setGoals(goals);
      }),
      finalize(() => {
        this.dashboardSignalService.setLoadingTransactions(false);
        this.dashboardSignalService.setLoadingCategories(false);
        this.dashboardSignalService.setLoadingBudgets(false);
        this.dashboardSignalService.setLoadingGoals(false);
      }),
    );
  }

  openAddDrawer(): void {
    this.dashboardSignalService.setFormState({
      ...defaultTransactionFormState,
      mode: 'add',
      isOpen: true,
      values: { ...defaultTransactionFormModel, date: new Date().toISOString().slice(0, 10) },
    });
  }

  openEditDrawer(transactionId: string): void {
    const transaction = this.dashboardSignalService
      .recentTransactions()
      .find((tx) => tx.id === transactionId);

    if (!transaction) {
      return;
    }

    this.dashboardSignalService.setFormState({
      ...defaultTransactionFormState,
      mode: 'edit',
      isOpen: true,
      editingTransactionId: transaction.id,
      values: {
        amount: String(transaction.amount),
        categoryId: transaction.categoryId,
        date: transaction.date.slice(0, 10),
        description: transaction.description ?? '',
      },
    });
  }

  closeDrawer(): void {
    this.dashboardSignalService.setFormState({
      ...defaultTransactionFormState,
      values: { ...defaultTransactionFormModel },
    });
  }

  openAddBudgetDrawer(): void {
    this.dashboardSignalService.setBudgetFormState({
      ...defaultBudgetFormState,
      mode: 'add',
      isOpen: true,
      values: { ...defaultBudgetFormModel },
    });
  }

  openEditBudgetDrawer(budgetId: string): void {
    const budget = this.dashboardSignalService.budgets().find((item) => item.id === budgetId);
    if (!budget) {
      return;
    }

    this.dashboardSignalService.setBudgetFormState({
      ...defaultBudgetFormState,
      mode: 'edit',
      isOpen: true,
      editingId: budget.id,
      values: {
        categoryId: budget.categoryId,
        limitAmount: String(budget.limitAmount),
        period: budget.period,
      },
    });
  }

  closeBudgetDrawer(): void {
    this.dashboardSignalService.setBudgetFormState({
      ...defaultBudgetFormState,
      values: { ...defaultBudgetFormModel },
    });
  }

  openAddGoalDrawer(): void {
    this.dashboardSignalService.setGoalFormState({
      ...defaultGoalFormState,
      mode: 'add',
      isOpen: true,
      values: {
        ...defaultGoalFormModel,
        targetDate: new Date().toISOString().slice(0, 10),
      },
    });
  }

  openEditGoalDrawer(goalId: string): void {
    const goal = this.dashboardSignalService.goals().find((item) => item.id === goalId);
    if (!goal) {
      return;
    }

    this.dashboardSignalService.setGoalFormState({
      ...defaultGoalFormState,
      mode: 'edit',
      isOpen: true,
      editingId: goal.id,
      values: {
        name: goal.name,
        targetAmount: String(goal.targetAmount),
        savedAmount: String(goal.savedAmount),
        targetDate: goal.targetDate.slice(0, 10),
      },
    });
  }

  closeGoalDrawer(): void {
    this.dashboardSignalService.setGoalFormState({
      ...defaultGoalFormState,
      values: { ...defaultGoalFormModel },
    });
  }

  openDeleteConfirm(transactionId: string): void {
    this.dashboardSignalService.setDeleteState({
      isOpen: true,
      targetTransactionId: transactionId,
    });
  }

  closeDeleteConfirm(): void {
    this.dashboardSignalService.setDeleteState({ ...defaultDeleteConfirmState });
  }

  createTransaction(values: TransactionFormModel): Observable<TransactionItem> {
    const category = this.getCategoryById(values.categoryId);

    return this.transactionApiService
      .createTransaction({
        amount: Number(values.amount),
        categoryId: values.categoryId,
        type: category?.type ?? 'expense',
        date: values.date,
        description: values.description.trim() || undefined,
      })
      .pipe(
        tap((transaction) => {
          this.dashboardSignalService.addTransaction(transaction);
        }),
      );
  }

  updateTransaction(values: TransactionFormModel): Observable<TransactionItem> {
    const formState = this.dashboardSignalService.formState();
    if (!formState.editingTransactionId) {
      throw new Error('Missing editing transaction id');
    }

    const category = this.getCategoryById(values.categoryId);

    return this.transactionApiService
      .updateTransaction(formState.editingTransactionId, {
        amount: Number(values.amount),
        categoryId: values.categoryId,
        type: category?.type,
        date: values.date,
        description: values.description.trim() || undefined,
      })
      .pipe(
        tap((transaction) => {
          this.dashboardSignalService.updateTransaction(formState.editingTransactionId!, transaction);
        }),
      );
  }

  deleteTransaction(transactionId: string): Observable<void> {
    return this.transactionApiService.deleteTransaction(transactionId).pipe(
      tap(() => {
        this.dashboardSignalService.removeTransaction(transactionId);
      }),
    );
  }

  confirmDelete(): Observable<void> {
    const transactionId = this.dashboardSignalService.deleteState().targetTransactionId;
    if (!transactionId) {
      throw new Error('Missing transaction id for delete');
    }

    return this.deleteTransaction(transactionId).pipe(
      tap(() => {
        this.closeDeleteConfirm();
      }),
    );
  }

  getTransactionById(transactionId: string): TransactionItem | undefined {
    return this.dashboardSignalService
      .recentTransactions()
      .find((transaction) => transaction.id === transactionId);
  }

  setTransactionSubmitting(isSubmitting: boolean): void {
    this.dashboardSignalService.formState.update((state) => ({
      ...state,
      isSubmitting,
    }));
  }

  setTransactionSubmitError(message: string | null): void {
    this.dashboardSignalService.formState.update((state) => ({
      ...state,
      submitError: message,
    }));
  }

  getCategoryById(categoryId: string): TransactionCategory | undefined {
    return this.dashboardSignalService.categories().find((category) => category.id === categoryId);
  }

  createBudget(values: BudgetFormModel): Observable<BudgetItem> {
    return this.budgetApiService
      .createBudget({
        categoryId: values.categoryId,
        limitAmount: Number(values.limitAmount),
        period: values.period,
      })
      .pipe(
        tap((budget) => {
          this.dashboardSignalService.addBudget(budget);
        }),
      );
  }

  updateBudget(values: BudgetFormModel): Observable<BudgetItem> {
    const formState = this.dashboardSignalService.budgetFormState();
    if (!formState.editingId) {
      throw new Error('Missing budget id');
    }

    return this.budgetApiService
      .updateBudget(formState.editingId, {
        categoryId: values.categoryId,
        limitAmount: Number(values.limitAmount),
        period: values.period,
      })
      .pipe(
        tap((budget) => {
          this.dashboardSignalService.updateBudget(formState.editingId!, budget);
        }),
      );
  }

  deleteBudget(budgetId: string): Observable<void> {
    return this.budgetApiService.deleteBudget(budgetId).pipe(
      tap(() => {
        this.dashboardSignalService.removeBudget(budgetId);
      }),
    );
  }

  setBudgetSubmitting(isSubmitting: boolean): void {
    this.dashboardSignalService.budgetFormState.update((state) => ({
      ...state,
      isSubmitting,
    }));
  }

  setBudgetSubmitError(message: string | null): void {
    this.dashboardSignalService.budgetFormState.update((state) => ({
      ...state,
      submitError: message,
    }));
  }

  createGoal(values: GoalFormModel): Observable<GoalItem> {
    return this.goalApiService
      .createGoal({
        name: values.name.trim(),
        targetAmount: Number(values.targetAmount),
        savedAmount: Number(values.savedAmount),
        targetDate: values.targetDate,
      })
      .pipe(
        tap((goal) => {
          this.dashboardSignalService.addGoal(goal);
        }),
      );
  }

  updateGoal(values: GoalFormModel): Observable<GoalItem> {
    const formState = this.dashboardSignalService.goalFormState();
    if (!formState.editingId) {
      throw new Error('Missing goal id');
    }

    return this.goalApiService
      .updateGoal(formState.editingId, {
        name: values.name.trim(),
        targetAmount: Number(values.targetAmount),
        savedAmount: Number(values.savedAmount),
        targetDate: values.targetDate,
      })
      .pipe(
        tap((goal) => {
          this.dashboardSignalService.updateGoal(formState.editingId!, goal);
        }),
      );
  }

  deleteGoal(goalId: string): Observable<void> {
    return this.goalApiService.deleteGoal(goalId).pipe(
      tap(() => {
        this.dashboardSignalService.removeGoal(goalId);
      }),
    );
  }

  setGoalSubmitting(isSubmitting: boolean): void {
    this.dashboardSignalService.goalFormState.update((state) => ({
      ...state,
      isSubmitting,
    }));
  }

  setGoalSubmitError(message: string | null): void {
    this.dashboardSignalService.goalFormState.update((state) => ({
      ...state,
      submitError: message,
    }));
  }

  // ---------- Accounts ----------

  loadAccounts(): void {
    this.accountApiService.getAccounts().subscribe({
      next: (accounts) => this.signalService.accounts.set(accounts),
    });
  }

  openAddAccountDrawer(): void {
    this.dashboardSignalService.accountFormState.set({
      ...defaultAccountFormState,
      mode: 'add',
      isOpen: true,
      values: { ...defaultAccountFormModel },
    });
  }

  openEditAccountDrawer(account: AccountItem): void {
    this.dashboardSignalService.accountFormState.set({
      mode: 'edit',
      isOpen: true,
      isSubmitting: false,
      submitError: null,
      editingId: account.id,
      values: { name: account.name, type: account.type, balance: String(account.balance) },
    });
  }

  closeAccountDrawer(): void {
    this.dashboardSignalService.accountFormState.update((s) => ({ ...s, isOpen: false }));
  }

  setAccountSubmitting(isSubmitting: boolean): void {
    this.dashboardSignalService.accountFormState.update((s) => ({ ...s, isSubmitting }));
  }

  setAccountSubmitError(message: string | null): void {
    this.dashboardSignalService.accountFormState.update((s) => ({ ...s, submitError: message }));
  }

  createAccount(values: AccountFormModel): Observable<AccountItem> {
    return this.accountApiService
      .createAccount({ name: values.name, type: values.type, balance: Number(values.balance) })
      .pipe(tap((account) => this.signalService.accounts.update((list) => [...list, account])));
  }

  updateAccount(values: AccountFormModel): Observable<AccountItem> {
    const id = this.dashboardSignalService.accountFormState().editingId!;
    return this.accountApiService
      .updateAccount(id, { name: values.name, type: values.type, balance: Number(values.balance) })
      .pipe(
        tap((updated) =>
          this.signalService.accounts.update((list) =>
            list.map((a) => (a.id === id ? updated : a)),
          ),
        ),
      );
  }

  deleteAccount(id: string): Observable<void> {
    return this.accountApiService
      .deleteAccount(id)
      .pipe(
        tap(() =>
          this.signalService.accounts.update((list) => list.filter((a) => a.id !== id)),
        ),
      );
  }

  // ---------- Settings ----------

  loadSettings(): void {
    this.settingsApiService.getSettings().subscribe({
      next: (res) =>
        this.signalService.settings.set({
          firstName: res.firstName ?? '',
          lastName: res.lastName ?? '',
          location: res.location ?? '',
          address: res.address ?? '',
          country: res.country ?? '',
        }),
    });
  }

  saveSettings(values: SettingsFormModel): Observable<unknown> {
    return this.settingsApiService.updateSettings(values).pipe(
      tap((res) =>
        this.signalService.settings.set({
          firstName: res.firstName ?? '',
          lastName: res.lastName ?? '',
          location: res.location ?? '',
          address: res.address ?? '',
          country: res.country ?? '',
        }),
      ),
    );
  }

  setSettingsSubmitting(isSubmitting: boolean): void {
    this.dashboardSignalService.settingsFormState.update((s) => ({ ...s, isSubmitting }));
  }

  setSettingsSubmitError(message: string | null): void {
    this.dashboardSignalService.settingsFormState.update((s) => ({ ...s, submitError: message }));
  }
}
