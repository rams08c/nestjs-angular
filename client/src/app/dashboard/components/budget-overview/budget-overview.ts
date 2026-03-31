import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../../../app.constant';
import { DataFlowService } from '../../../shared-services/data-flow.service';

@Component({
  selector: 'app-budget-overview',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './budget-overview.html',
  host: {
    class: 'block h-full',
  },
})
export class BudgetOverview {
  private dataFlowService = inject(DataFlowService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly budgets = this.dataFlowService.budgetsForCurrentUser;
  readonly loadingBudgets = this.dataFlowService.loadingBudgets;
  readonly deleteError = signal<string | null>(null);
  readonly totalBudgeted = computed(() =>
    this.budgets().reduce((sum, budget) => sum + budget.limitAmount, 0),
  );

  openAddBudget(): void {
    this.deleteError.set(null);
    this.dataFlowService.openAddBudgetDrawer();
  }

  openEditBudget(budgetId: string): void {
    this.deleteError.set(null);
    this.dataFlowService.openEditBudgetDrawer(budgetId);
  }

  deleteBudget(budgetId: string): void {
    if (typeof window !== 'undefined' && !window.confirm('Delete this budget?')) {
      return;
    }

    this.deleteError.set(null);
    this.dataFlowService.deleteBudget(budgetId).subscribe({
      error: () => {
        this.deleteError.set(APP_ERROR_MESSAGES.BUDGET.DELETE_FAILED);
      },
    });
  }

  progressClass(progressPercent: number): string {
    if (progressPercent >= 100) {
      return 'progress progress-error';
    }

    if (progressPercent >= 80) {
      return 'progress progress-warning';
    }

    return 'progress progress-success';
  }
}