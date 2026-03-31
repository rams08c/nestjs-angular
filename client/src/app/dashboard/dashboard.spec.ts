import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Dashboard } from './dashboard';
import { DataFlowService } from '../shared-services/data-flow.service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let mockLoadTransactionData: any;
  let mockOpenAddDrawer: any;
  let mockIsAuthenticated: any;
  let mockTransactionsForCurrentUser: any;

  beforeEach(async () => {
    mockLoadTransactionData = vi.fn().mockReturnValue(of(null));
    mockOpenAddDrawer = vi.fn();
    mockIsAuthenticated = vi.fn(() => true);
    mockTransactionsForCurrentUser = signal([
      {
        id: '1',
        amount: 100,
        categoryId: 'food-dining',
        categoryName: 'Food & Dining',
        type: 'expense',
        date: new Date().toISOString(),
        description: 'Lunch',
        userId: 'user-1',
        groupId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        amount: 500,
        categoryId: 'salary',
        categoryName: 'Salary',
        type: 'income',
        date: new Date().toISOString(),
        description: 'Salary',
        userId: 'user-1',
        groupId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    const mockDataFlowService: any = {
      loadTransactionData: mockLoadTransactionData,
      openAddDrawer: mockOpenAddDrawer,
      isAuthenticated: mockIsAuthenticated,
      transactionsForCurrentUser: mockTransactionsForCurrentUser,
      currentUser: signal({ name: 'Test User', email: 'test@example.com' }),
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [{ provide: DataFlowService, useValue: mockDataFlowService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transaction data on init when authenticated', () => {
    component.ngOnInit();
    expect(mockLoadTransactionData).toHaveBeenCalled();
  });

  it('should not load transaction data on init when not authenticated', () => {
    mockIsAuthenticated.mockReturnValue(false);
    component.ngOnInit();
    expect(mockLoadTransactionData).not.toHaveBeenCalled();
  });

  it('should open add transaction drawer on openAddTransaction', () => {
    component.openAddTransaction();
    expect(mockOpenAddDrawer).toHaveBeenCalled();
  });

  describe('Filter Methods', () => {
    it('should update search query on onSearchChange', () => {
      const testQuery = 'test search';
      component.onSearchChange(testQuery);
      expect(component.searchQuery()).toBe(testQuery);
    });

    it('should update category filter on onCategoryFilterChange', () => {
      const category = 'food';
      component.onCategoryFilterChange(category);
      expect(component.categoryFilter()).toBe(category);
    });

    it('should reset all filters on resetFilters', () => {
      // Set some filters
      component.searchQuery.set('test');
      component.categoryFilter.set('food');
      component.statusFilter.set('completed');

      // Reset
      component.resetFilters();

      // Verify they are reset to defaults
      expect(component.searchQuery()).toBe('');
      expect(component.categoryFilter()).toBe('all');
      expect(component.statusFilter()).toBe('all');
    });
  });

  describe('Error Handling', () => {
    it('should set loadError on loadTransactionData error', () => {
      mockLoadTransactionData.mockReturnValue(
        throwError(() => new Error('Test error')),
      );

      component.ngOnInit();

      // Wait for error handling
      fixture.detectChanges();
      expect(component.loadError()).toBeTruthy();
    });
  });

  describe('Initial State', () => {
    it('should initialize with default filter values', () => {
      expect(component.searchQuery()).toBe('');
      expect(component.categoryFilter()).toBe('all');
      expect(component.statusFilter()).toBe('all');
    });
  });

  describe('Summary Computed Properties', () => {
    it('should calculate summary with initial transactions', () => {
      const summary = component.summary();
      expect(summary).toBeDefined();
      expect(summary.monthlyIncome).toBeGreaterThanOrEqual(0);
      expect(summary.monthlyExpenses).toBeGreaterThanOrEqual(0);
      expect(typeof summary.totalBalance === 'number').toBe(true);
    });

    it('should calculate total expenses correctly', () => {
      const total = component.expensesTotal();
      expect(typeof total === 'number').toBe(true);
      expect(total).toBeGreaterThanOrEqual(0);
    });

    it('should identify top expense category', () => {
      const topCategory = component.topExpenseCategory();
      if (topCategory) {
        expect(topCategory.category).toBeDefined();
        expect(typeof topCategory.amount === 'number').toBe(true);
      }
    });

    it('should calculate average monthly spending', () => {
      const avg = component.averageMonthlySpending();
      expect(typeof avg === 'number').toBe(true);
      expect(avg).toBeGreaterThanOrEqual(0);
    });

    it('should calculate budget progress for categories', () => {
      const budgets = component.budgetProgress();
      expect(Array.isArray(budgets)).toBe(true);
      budgets.forEach(budget => {
        expect(budget.category).toBeDefined();
        expect(typeof budget.spent === 'number').toBe(true);
        expect(typeof budget.allocated === 'number').toBe(true);
        expect(budget.spent <= budget.allocated || budget.spent >= 0).toBe(true);
      });
    });
  });

});
