import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { APP_TEXT } from '../../../app.constant';
import { DataFlowService } from '../../../shared-services/data-flow.service';

@Component({
  selector: 'app-recent-transactions',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-transactions.html',
})
export class RecentTransactions {
  private svc = inject(DashboardSignalService);
  private dataFlowService = inject(DataFlowService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly transactions = this.dataFlowService.transactionsForCurrentUser;
  readonly loadingTransactions = this.svc.loadingTransactions;

  /**
   * Returns daisyUI badge CSS classes based on category name
   * Different categories get different color assignments
   */
  getCategoryBadgeClass(categoryName: string | undefined): string {
    if (!categoryName) return 'badge-primary';
    
    const category = categoryName.toLowerCase();
    
    // Map categories to badge variants
    if (category.includes('food') || category.includes('dining')) {
      return 'badge-accent';
    } else if (category.includes('transport') || category.includes('travel')) {
      return 'badge-info';
    } else if (category.includes('entertainment')) {
      return 'badge-success';
    } else if (category.includes('utilities') || category.includes('bills')) {
      return 'badge-warning';
    } else if (category.includes('shopping') || category.includes('retail')) {
      return 'badge-secondary';
    } else if (category.includes('health') || category.includes('medical')) {
      return 'badge-error';
    }
    
    return 'badge-primary';
  }

  onView(transactionId: string): void {
    // For now, open edit drawer to view/edit the transaction
    // This can be enhanced later with a dedicated view modal
    this.dataFlowService.openEditDrawer(transactionId);
  }

  onEdit(transactionId: string): void {
    this.dataFlowService.openEditDrawer(transactionId);
  }

  onDelete(transactionId: string): void {
    this.dataFlowService.openDeleteConfirm(transactionId);
  }
}
