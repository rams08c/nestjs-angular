import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { APP_TEXT } from '../../../app.constant';

@Component({
  selector: 'app-financial-overview',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './financial-overview.html',
})
export class FinancialOverview {
  private svc = inject(DashboardSignalService);
  readonly text = APP_TEXT.DASHBOARD;
  readonly summary = this.svc.summary;
  readonly topCategories = this.svc.topCategories;
  readonly spendingTrend = this.svc.spendingTrend;

  readonly topExpenseCategory = computed(() => {
    const categories = this.topCategories();
    return categories.length > 0 ? categories[0] : null;
  });

  readonly averageMonthlySpending = computed(() => {
    const trend = this.spendingTrend();
    if (trend.length === 0) return 0;
    const total = trend.reduce((sum, item) => sum + item.amount, 0);
    return total / trend.length;
  });

  /**
   * Generates SVG path data for a sparkline chart
   * Scales the spending trend data to fit within viewBox coordinates
   */
  generateSparklinePathData(): string {
    const trend = this.spendingTrend();
    if (trend.length === 0) return '';

    const width = 100;
    const height = 30;
    const padding = 2;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    const minAmount = Math.min(...trend.map(d => d.amount));
    const maxAmount = Math.max(...trend.map(d => d.amount));
    const range = maxAmount - minAmount || 1;

    const points = trend.map((item, i) => {
      const x = padding + (i / (trend.length - 1 || 1)) * innerWidth;
      const y = padding + innerHeight - ((item.amount - minAmount) / range) * innerHeight;
      return [x, y];
    });

    if (points.length === 0) return '';

    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i][0]} ${points[i][1]}`;
    }

    return path;
  }
}
