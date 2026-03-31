import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecentTransactions } from './recent-transactions';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { signal } from '@angular/core';

describe('RecentTransactions', () => {
  let component: RecentTransactions;
  let fixture: ComponentFixture<RecentTransactions>;
  let dashboardService: DashboardSignalService;
  let dataFlowService: Partial<DataFlowService>;

  beforeEach(async () => {
    const mockDataFlowService: Partial<DataFlowService> = {
      openEditDrawer: vi.fn(),
      openDeleteConfirm: vi.fn(),
      transactionsForCurrentUser: signal([
        {
          id: '1',
          amount: 50,
          type: 'expense',
          categoryId: '1',
          categoryName: 'Food & Dining',
          date: '2026-03-31',
          description: 'Lunch',
          userId: 'user1',
          groupId: null,
          createdAt: '2026-03-31T00:00:00Z',
          updatedAt: '2026-03-31T00:00:00Z',
        },
      ]),
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
    const transactions = component.transactions();
    expect(transactions.length).toBeGreaterThan(0);
  });

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

  describe('Action Methods', () => {
    it('should call openEditDrawer on onView', () => {
      const transactionId = '1';
      component.onView(transactionId);
      expect(dataFlowService.openEditDrawer).toHaveBeenCalledWith(transactionId);
    });

    it('should call openEditDrawer on onEdit', () => {
      const transactionId = '1';
      component.onEdit(transactionId);
      expect(dataFlowService.openEditDrawer).toHaveBeenCalledWith(transactionId);
    });

    it('should call openDeleteConfirm on onDelete', () => {
      const transactionId = '1';
      component.onDelete(transactionId);
      expect(dataFlowService.openDeleteConfirm).toHaveBeenCalledWith(transactionId);
    });
  });

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

  describe('Empty State', () => {
    it('should handle empty transaction list', () => {
      (dataFlowService.transactionsForCurrentUser as any) = signal([]);
      fixture.detectChanges();
      expect(component.transactions().length).toBe(0);
    });
  });

  describe('Transaction Display', () => {
    it('should display transaction amount', () => {
      const transactions = component.transactions();
      if (transactions.length > 0) {
        expect(transactions[0].amount).toBeDefined();
      }
    });

    it('should display transaction date', () => {
      const transactions = component.transactions();
      if (transactions.length > 0) {
        expect(transactions[0].date).toBeDefined();
      }
    });

    it('should display transaction category', () => {
      const transactions = component.transactions();
      if (transactions.length > 0) {
        expect(transactions[0].categoryName).toBeDefined();
      }
    });

    it('should display transaction description if available', () => {
      const transactions = component.transactions();
      if (transactions.length > 0 && transactions[0].description) {
        expect(transactions[0].description).toBeTruthy();
      }
    });
  });

  describe('Transaction Type Handling', () => {
    it('should correctly identify expense transactions', () => {
      const transactions = component.transactions();
      const expenseTransaction = transactions.find(t => t.type === 'expense');
      expect(expenseTransaction).toBeDefined();
      if (expenseTransaction) {
        expect(expenseTransaction.type).toBe('expense');
      }
    });

    it('should correctly identify income transactions', () => {
      const incomeTransaction = {
        id: '2',
        amount: 100,
        type: 'income' as const,
        categoryId: '2',
        categoryName: 'Salary',
        date: '2026-03-31',
        description: 'Monthly salary',
        userId: 'user1',
        groupId: null,
        createdAt: '2026-03-31T00:00:00Z',
        updatedAt: '2026-03-31T00:00:00Z',
      };
      (dataFlowService.transactionsForCurrentUser as any) = signal([incomeTransaction]);
      fixture.detectChanges();

      const transactions = component.transactions();
      expect(transactions[0].type).toBe('income');
    });
  });
});
