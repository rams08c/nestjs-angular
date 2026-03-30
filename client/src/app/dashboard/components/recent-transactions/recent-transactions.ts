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

  onEdit(transactionId: string): void {
    this.dataFlowService.openEditDrawer(transactionId);
  }

  onDelete(transactionId: string): void {
    this.dataFlowService.openDeleteConfirm(transactionId);
  }
}
