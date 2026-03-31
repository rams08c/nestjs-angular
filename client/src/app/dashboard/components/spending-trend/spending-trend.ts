import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { APP_TEXT } from '../../../app.constant';

@Component({
  selector: 'app-spending-trend',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spending-trend.html',
})
export class SpendingTrend {
  private svc = inject(DashboardSignalService);
  private dataFlowService = inject(DataFlowService);
  readonly text = APP_TEXT.DASHBOARD;
  readonly trend = this.svc.spendingTrend;
  readonly currencySymbol = this.dataFlowService.currencySymbol;

  readonly maxAmount = computed(() =>
    Math.max(...this.svc.spendingTrend().map(d => d.amount), 1)
  );

  barHeight(amount: number): number {
    return Math.round((amount / this.maxAmount()) * 100);
  }

  shortDate(dateStr: string): string {
    return dateStr.slice(8); // day digits from YYYY-MM-DD
  }
}
