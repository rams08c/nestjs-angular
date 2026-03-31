import { Injectable, computed } from '@angular/core';
import { finalize, forkJoin, Observable, tap } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class DataFlowService {
  constructor(
    private signalService: SignalService,
    private dashboardSignalService: DashboardSignalService,
    private transactionApiService: TransactionApiService,
  ) {}

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
}
