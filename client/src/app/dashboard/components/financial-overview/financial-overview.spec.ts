import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialOverview } from './financial-overview';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { signal } from '@angular/core';

describe('FinancialOverview', () => {
  let component: FinancialOverview;
  let fixture: ComponentFixture<FinancialOverview>;
  let dashboardService: DashboardSignalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialOverview],
      providers: [DashboardSignalService],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialOverview);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardSignalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display financial summary from service', () => {
    expect(component.summary()).toBeDefined();
    expect(component.summary().totalBalance).toBeGreaterThan(0);
    expect(component.summary().monthlyIncome).toBeGreaterThan(0);
    expect(component.summary().monthlyExpenses).toBeGreaterThan(0);
  });

  it('should display top expense category', () => {
    const topCategory = component.topExpenseCategory();
    expect(topCategory).toBeDefined();
    expect(topCategory).toBeTruthy();
  });

  it('should calculate average monthly spending from spending trend', () => {
    const average = component.averageMonthlySpending();
    expect(average).toBeGreaterThan(0);

    // Verify calculation is correct
    const trend = component.spendingTrend();
    const expectedAverage = trend.reduce((sum, item) => sum + item.amount, 0) / trend.length;
    expect(average).toBe(expectedAverage);
  });

  it('should generate valid SVG sparkline path data', () => {
    const pathData = component.generateSparklinePathData();
    expect(pathData).toBeTruthy();
    expect(pathData).toContain('M');
    expect(pathData).toContain('L');
  });

  it('should handle empty spending trend gracefully', () => {
    // Temporarily set empty spending trend
    dashboardService.spendingTrend.set([]);
    const pathData = component.generateSparklinePathData();
    expect(pathData).toBe('');

    // Restore original data
    dashboardService.spendingTrend.set(component.spendingTrend());
  });

  it('should return null for top expense category when no categories', () => {
    // Temporarily set empty categories
    dashboardService.topCategories.set([]);
    const topCategory = component.topExpenseCategory();
    expect(topCategory).toBeNull();

    // Restore original data
    dashboardService.topCategories.set(component.topCategories());
  });

  describe('Sparkline Generation', () => {
    it('should scale data points correctly within SVG viewBox', () => {
      const pathData = component.generateSparklinePathData();
      const trend = component.spendingTrend();

      if (trend.length > 0) {
        expect(pathData).toContain('M');
        // First point should be close to the start
        const firstPointMatch = pathData.match(/M\s([\d.]+)\s([\d.]+)/);
        expect(firstPointMatch).toBeTruthy();
      }
    });

    it('should handle single data point in spending trend', () => {
      // Set single data point
      const singlePoint = [{ date: '2026-03-31', amount: 50 }];
      dashboardService.spendingTrend.set(singlePoint);

      const pathData = component.generateSparklinePathData();
      expect(pathData).toBeTruthy();

      // Restore original data
      dashboardService.spendingTrend.set(component.spendingTrend());
    });

    it('should handle uniform spending trend (same amount every day)', () => {
      // Set uniform data
      const uniformData = Array(30)
        .fill(null)
        .map((_, i) => ({
          date: `2026-03-${(i + 1).toString().padStart(2, '0')}`,
          amount: 50,
        }));
      dashboardService.spendingTrend.set(uniformData);

      const pathData = component.generateSparklinePathData();
      expect(pathData).toBeTruthy();

      // Restore original data
      dashboardService.spendingTrend.set(component.spendingTrend());
    });
  });

  describe('Computed Values', () => {
    it('topExpenseCategory should be the first category in topCategories', () => {
      const topCategory = component.topExpenseCategory();
      const allCategories = component.topCategories();

      expect(topCategory?.category).toBe(allCategories[0]?.category);
    });

    it('averageMonthlySpending should reflect changes in spending trend', () => {
      const initialAverage = component.averageMonthlySpending();

      // Update spending trend with different data
      const newTrend = [{ date: '2026-03-31', amount: 100 }];
      dashboardService.spendingTrend.set(newTrend);

      const newAverage = component.averageMonthlySpending();
      expect(newAverage).toBe(100);

      // Restore original data
      dashboardService.spendingTrend.set(component.spendingTrend());
    });
  });
});
