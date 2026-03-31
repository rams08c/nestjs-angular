import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { APP_TEXT } from '../../../app.constant';

interface BudgetItem {
  category: string;
  spent: number;
  allocated: number;
}

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
  readonly transactions = this.dataFlowService.transactionsForCurrentUser;

  readonly budgetProgress = computed<BudgetItem[]>(() => {
    const transactions = this.transactions();
    const categoryMap = new Map<string, number>();

    transactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        const category = tx.categoryName ?? tx.categoryId;
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + (tx.amount || 0));
      });

    const budgets: BudgetItem[] = [];
    const allocations: Record<string, number> = {
      'Food & Dining': 500,
      'Transport': 300,
      'Entertainment': 200,
      'Utilities': 400,
      'Shopping': 600,
    };

    categoryMap.forEach((spent, category) => {
      budgets.push({
        category,
        spent: Math.round(spent),
        allocated: allocations[category] || 500,
      });
    });

    return budgets.sort((a, b) => b.spent - a.spent).slice(0, 5);
  });
}
