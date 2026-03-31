import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../../../app.constant';
import { DataFlowService } from '../../../shared-services/data-flow.service';

@Component({
  selector: 'app-goal-overview',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './goal-overview.html',
  host: {
    class: 'block h-full',
  },
})
export class GoalOverview {
  private dataFlowService = inject(DataFlowService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly goals = this.dataFlowService.goalsForCurrentUser;
  readonly loadingGoals = this.dataFlowService.loadingGoals;
  readonly deleteError = signal<string | null>(null);
  readonly totalSaved = computed(() => this.goals().reduce((sum, goal) => sum + goal.savedAmount, 0));

  openAddGoal(): void {
    this.deleteError.set(null);
    this.dataFlowService.openAddGoalDrawer();
  }

  openEditGoal(goalId: string): void {
    this.deleteError.set(null);
    this.dataFlowService.openEditGoalDrawer(goalId);
  }

  deleteGoal(goalId: string): void {
    if (typeof window !== 'undefined' && !window.confirm('Delete this goal?')) {
      return;
    }

    this.deleteError.set(null);
    this.dataFlowService.deleteGoal(goalId).subscribe({
      error: () => {
        this.deleteError.set(APP_ERROR_MESSAGES.GOAL.DELETE_FAILED);
      },
    });
  }

  progressClass(progressPercent: number): string {
    if (progressPercent >= 100) {
      return 'progress progress-success';
    }

    if (progressPercent >= 60) {
      return 'progress progress-info';
    }

    return 'progress progress-primary';
  }
}