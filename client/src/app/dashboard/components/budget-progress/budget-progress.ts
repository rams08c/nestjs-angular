import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { DashboardSignalService, BudgetCategory } from '../../services/dashboard-signal.service';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { APP_TEXT } from '../../../app.constant';

@Component({
  selector: 'app-budget-progress',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './budget-progress.html',
})
export class BudgetProgress {
  private svc = inject(DashboardSignalService);
  private dataFlowService = inject(DataFlowService);
  readonly text = APP_TEXT.DASHBOARD;
  readonly budgetProgress = this.svc.budgetProgress;
  readonly currencySymbol = this.dataFlowService.currencySymbol;

  percentage(cat: BudgetCategory): number {
    return Math.min(100, Math.round((cat.spent / cat.allocated) * 100));
  }

  progressColor(cat: BudgetCategory): string {
    const pct = this.percentage(cat);
    if (pct >= 90) return 'progress-error';
    if (pct >= 70) return 'progress-warning';
    return 'progress-success';
  }
}
