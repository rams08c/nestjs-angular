import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecentTransactions } from './recent-transactions';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { signal } from '@angular/core';
import { defaultPaginationMeta, defaultTransactionFilters } from '../transaction-form/transaction.model';

const makeTransaction = (overrides = {}) => ({
  id: '1',
  amount: 50,
  type: 'expense' as const,
  categoryId: '1',
  categoryName: 'Food & Dining',
  date: '2026-03-31',
  description: 'Lunch',
  userId: 'user1',
  groupId: null,
  createdAt: '2026-03-31T00:00:00Z',
  updatedAt: '2026-03-31T00:00:00Z',
  ...overrides,
});

describe('RecentTransactions', () => {
  let component: RecentTransactions;
  let fixture: ComponentFixture<RecentTransactions>;
  let dashboardService: DashboardSignalService;
  let dataFlowService: Partial<DataFlowService>;

  beforeEach(async () => {
    const mockDataFlowService: Partial<DataFlowService> = {
      openEditDrawer: vi.fn(),
      openDeleteConfirm: vi.fn(),
      applyTransactionFilters: vi.fn(),
      goToTransactionPage: vi.fn(),
      resetTransactionFilters: vi.fn(),
      transactionsForCurrentUser: signal([makeTransaction()]),
      categories: signal([
        { id: '1', name: 'Food & Dining', type: 'expense' as const, isSystem: true, ownerUserId: null, createdAt: '', updatedAt: '' },
      ]),
      transactionFilters: signal({ ...defaultTransactionFilters }),
      transactionPaginationMeta: signal({ ...defaultPaginationMeta, total: 1, totalPages: 1 }),
      currencyCode: signal('USD'),
    };

    await TestBed.configureTestingModule({
      imports: [RecentTransactions],
      providers: [
        DashboardSignalService,
        { provide: DataFlowService, useValue: mockDataFlowService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentTransactions);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardSignalService);
    dataFlowService = TestBed.inject(DataFlowService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display transactions from service', () => {
    expect(component.transactions().length).toBeGreaterThan(0);
  });

  // ---------- Category Badge Classes ----------

  describe('Category Badge Classes', () => {
    it('should return badge-accent for food categories', () => {
      expect(component.getCategoryBadgeClass('Food & Dining')).toBe('badge-accent');
      expect(component.getCategoryBadgeClass('food')).toBe('badge-accent');
    });

    it('should return badge-info for transport categories', () => {
      expect(component.getCategoryBadgeClass('Transport')).toBe('badge-info');
      expect(component.getCategoryBadgeClass('travel')).toBe('badge-info');
    });

    it('should return badge-success for entertainment', () => {
      expect(component.getCategoryBadgeClass('Entertainment')).toBe('badge-success');
    });

    it('should return badge-warning for utilities', () => {
      expect(component.getCategoryBadgeClass('Utilities')).toBe('badge-warning');
      expect(component.getCategoryBadgeClass('bills')).toBe('badge-warning');
    });

    it('should return badge-secondary for shopping', () => {
      expect(component.getCategoryBadgeClass('Shopping')).toBe('badge-secondary');
      expect(component.getCategoryBadgeClass('retail')).toBe('badge-secondary');
    });

    it('should return badge-error for health categories', () => {
      expect(component.getCategoryBadgeClass('Health')).toBe('badge-error');
      expect(component.getCategoryBadgeClass('medical')).toBe('badge-error');
    });

    it('should return badge-primary as default for unknown categories', () => {
      expect(component.getCategoryBadgeClass('Unknown')).toBe('badge-primary');
      expect(component.getCategoryBadgeClass(undefined)).toBe('badge-primary');
    });

    it('should be case-insensitive', () => {
      expect(component.getCategoryBadgeClass('FOOD & DINING')).toBe('badge-accent');
      expect(component.getCategoryBadgeClass('TransPort')).toBe('badge-info');
    });
  });

  // ---------- Action Methods ----------

  describe('Action Methods', () => {
    it('should call openEditDrawer on onView', () => {
      component.onView('1');
      expect(dataFlowService.openEditDrawer).toHaveBeenCalledWith('1');
    });

    it('should call openEditDrawer on onEdit', () => {
      component.onEdit('1');
      expect(dataFlowService.openEditDrawer).toHaveBeenCalledWith('1');
    });

    it('should call openDeleteConfirm on onDelete', () => {
      component.onDelete('1');
      expect(dataFlowService.openDeleteConfirm).toHaveBeenCalledWith('1');
    });
  });

  // ---------- Filter Methods ----------

  describe('Filter Methods', () => {
    it('should call applyTransactionFilters with search value on search change', () => {
      const event = { target: { value: 'lunch' } } as unknown as Event;
      component.onSearchChange(event);
      expect(dataFlowService.applyTransactionFilters).toHaveBeenCalledWith({ search: 'lunch' });
    });

    it('should call applyTransactionFilters with undefined search when input is blank', () => {
      const event = { target: { value: '  ' } } as unknown as Event;
      component.onSearchChange(event);
      expect(dataFlowService.applyTransactionFilters).toHaveBeenCalledWith({ search: undefined });
    });

    it('should call applyTransactionFilters with type on type change', () => {
      const event = { target: { value: 'expense' } } as unknown as Event;
      component.onTypeFilterChange(event);
      expect(dataFlowService.applyTransactionFilters).toHaveBeenCalledWith({ type: 'expense' });
    });

    it('should call applyTransactionFilters with undefined type when all types selected', () => {
      const event = { target: { value: '' } } as unknown as Event;
      component.onTypeFilterChange(event);
      expect(dataFlowService.applyTransactionFilters).toHaveBeenCalledWith({ type: undefined });
    });

    it('should call applyTransactionFilters with categoryId on category change', () => {
      const event = { target: { value: 'cat-1' } } as unknown as Event;
      component.onCategoryFilterChange(event);
      expect(dataFlowService.applyTransactionFilters).toHaveBeenCalledWith({ categoryId: 'cat-1' });
    });

    it('should call applyTransactionFilters with undefined categoryId when all selected', () => {
      const event = { target: { value: '' } } as unknown as Event;
      component.onCategoryFilterChange(event);
      expect(dataFlowService.applyTransactionFilters).toHaveBeenCalledWith({ categoryId: undefined });
    });

    it('should call applyTransactionFilters with dateFrom on date from change', () => {
      const event = { target: { value: '2026-01-01' } } as unknown as Event;
      component.onDateFromChange(event);
      expect(dataFlowService.applyTransactionFilters).toHaveBeenCalledWith({ dateFrom: '2026-01-01' });
    });

    it('should call applyTransactionFilters with dateTo on date to change', () => {
      const event = { target: { value: '2026-03-31' } } as unknown as Event;
      component.onDateToChange(event);
      expect(dataFlowService.applyTransactionFilters).toHaveBeenCalledWith({ dateTo: '2026-03-31' });
    });

    it('should call resetTransactionFilters on resetFilters', () => {
      component.resetFilters();
      expect(dataFlowService.resetTransactionFilters).toHaveBeenCalled();
    });
  });

  // ---------- Pagination Methods ----------

  describe('Pagination Methods', () => {
    it('should call goToTransactionPage with previous page on prevPage', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 20, page: 2, limit: 10, totalPages: 2,
      });
      component.prevPage();
      expect(dataFlowService.goToTransactionPage).toHaveBeenCalledWith(1);
    });

    it('should not navigate on prevPage when on first page', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 20, page: 1, limit: 10, totalPages: 2,
      });
      component.prevPage();
      expect(dataFlowService.goToTransactionPage).not.toHaveBeenCalled();
    });

    it('should call goToTransactionPage with next page on nextPage', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 20, page: 1, limit: 10, totalPages: 2,
      });
      component.nextPage();
      expect(dataFlowService.goToTransactionPage).toHaveBeenCalledWith(2);
    });

    it('should not navigate on nextPage when on last page', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 20, page: 2, limit: 10, totalPages: 2,
      });
      component.nextPage();
      expect(dataFlowService.goToTransactionPage).not.toHaveBeenCalled();
    });

    it('should call goToTransactionPage with specific page on goToPage', () => {
      component.goToPage(3);
      expect(dataFlowService.goToTransactionPage).toHaveBeenCalledWith(3);
    });

    it('hasPrev should be false on page 1', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 20, page: 1, limit: 10, totalPages: 2,
      });
      expect(component.hasPrev()).toBe(false);
    });

    it('hasPrev should be true on page 2+', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 20, page: 2, limit: 10, totalPages: 2,
      });
      expect(component.hasPrev()).toBe(true);
    });

    it('hasNext should be false on last page', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 20, page: 2, limit: 10, totalPages: 2,
      });
      expect(component.hasNext()).toBe(false);
    });

    it('hasNext should be true when not on last page', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 20, page: 1, limit: 10, totalPages: 2,
      });
      expect(component.hasNext()).toBe(true);
    });

    it('should generate correct pageNumbers array', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 30, page: 1, limit: 10, totalPages: 3,
      });
      expect(component.pageNumbers()).toEqual([1, 2, 3]);
    });

    it('rangeStart should compute correctly', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 25, page: 2, limit: 10, totalPages: 3,
      });
      expect(component.rangeStart()).toBe(11);
    });

    it('rangeEnd should not exceed total', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 25, page: 3, limit: 10, totalPages: 3,
      });
      expect(component.rangeEnd()).toBe(25);
    });

    it('rangeStart should be 0 when total is 0', () => {
      (dataFlowService.transactionPaginationMeta as any) = signal({
        total: 0, page: 1, limit: 10, totalPages: 0,
      });
      expect(component.rangeStart()).toBe(0);
    });
  });

  // ---------- Loading State ----------

  describe('Loading State', () => {
    it('should display loading state', () => {
      dashboardService.loadingTransactions.set(true);
      fixture.detectChanges();
      expect(component.loadingTransactions()).toBe(true);
    });

    it('should hide loading state', () => {
      dashboardService.loadingTransactions.set(false);
      fixture.detectChanges();
      expect(component.loadingTransactions()).toBe(false);
    });
  });

  // ---------- Empty State ----------

  describe('Empty State', () => {
    it('should handle empty transaction list', () => {
      (dataFlowService.transactionsForCurrentUser as any) = signal([]);
      fixture.detectChanges();
      expect(component.transactions().length).toBe(0);
    });
  });

  // ---------- Transaction Display ----------

  describe('Transaction Display', () => {
    it('should display transaction amount', () => {
      expect(component.transactions()[0].amount).toBeDefined();
    });

    it('should display transaction date', () => {
      expect(component.transactions()[0].date).toBeDefined();
    });

    it('should display transaction category', () => {
      expect(component.transactions()[0].categoryName).toBeDefined();
    });

    it('should display transaction description if available', () => {
      expect(component.transactions()[0].description).toBeTruthy();
    });
  });

  // ---------- Transaction Type Handling ----------

  describe('Transaction Type Handling', () => {
    it('should correctly identify expense transactions', () => {
      const tx = component.transactions().find(t => t.type === 'expense');
      expect(tx).toBeDefined();
    });

    it('should correctly identify income transactions', () => {
      (dataFlowService.transactionsForCurrentUser as any) = signal([
        makeTransaction({ id: '2', type: 'income', categoryName: 'Salary', description: 'Monthly salary' }),
      ]);
      fixture.detectChanges();
      expect(component.transactions()[0].type).toBe('income');
    });
  });
});

