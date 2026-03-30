import { Component, ChangeDetectionStrategy, computed, inject, OnInit, signal } from '@angular/core';
import { SidebarNav } from './components/sidebar-nav/sidebar-nav';
import { RightPanel } from './components/right-panel/right-panel';
import { FinancialOverview } from './components/financial-overview/financial-overview';
import { SpendingTrend } from './components/spending-trend/spending-trend';
import { RecentTransactions } from './components/recent-transactions/recent-transactions';
import { BudgetProgress } from './components/budget-progress/budget-progress';
import { TopCategories } from './components/top-categories/top-categories';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../app.constant';
import { DataFlowService } from '../shared-services/data-flow.service';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { DeleteConfirm } from './components/delete-confirm/delete-confirm';

@Component({
  selector: 'app-dashboard',
  imports: [
    SidebarNav,
    RightPanel,
    FinancialOverview,
    SpendingTrend,
    RecentTransactions,
    BudgetProgress,
    TopCategories,
    TransactionForm,
    DeleteConfirm,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private dataFlowService = inject(DataFlowService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly isAuthenticated = computed(() => this.dataFlowService.isAuthenticated());
  readonly loadError = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.dataFlowService.isAuthenticated()) {
      return;
    }

    this.dataFlowService.loadTransactionData().subscribe({
      error: () => {
        this.loadError.set(APP_ERROR_MESSAGES.TRANSACTION.LOAD_FAILED);
      },
    });
  }

  openAddTransaction(): void {
    this.dataFlowService.openAddDrawer();
  }
}
