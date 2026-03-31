import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { APP_TEXT } from '../../../app.constant';

@Component({
  selector: 'app-right-panel',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './right-panel.html',
})
export class RightPanel {
  private dataFlowService = inject(DataFlowService);
  readonly text = APP_TEXT.DASHBOARD;
  readonly currentUser = this.dataFlowService.currentUser;
  readonly budgets = this.dataFlowService.budgetsForCurrentUser;
  readonly goals = this.dataFlowService.goalsForCurrentUser;

  readonly budgetProgress = computed(() => this.budgets().slice(0, 4));
  readonly upcomingGoals = computed(() =>
    [...this.goals()]
      .sort((left, right) => new Date(left.targetDate).getTime() - new Date(right.targetDate).getTime())
      .slice(0, 3),
  );
}
