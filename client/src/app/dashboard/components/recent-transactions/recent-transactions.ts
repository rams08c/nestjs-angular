import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { APP_TEXT } from '../../../app.constant';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { TransactionType } from '../transaction-form/transaction.model';

interface AmountRange {
  label: string;
  value: string;
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-recent-transactions',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-transactions.html',
  host: {
    class: 'block',
  },
})
export class RecentTransactions {
  private svc = inject(DashboardSignalService);
  private dataFlowService = inject(DataFlowService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly transactions = this.dataFlowService.transactionsForCurrentUser;
  readonly loadingTransactions = this.svc.loadingTransactions;
  readonly currencyCode = this.dataFlowService.currencyCode;
  readonly currencySymbol = this.dataFlowService.currencySymbol;
  readonly categories = this.dataFlowService.categories;
  readonly filterParams = this.dataFlowService.transactionFilters;
  readonly paginationMeta = this.dataFlowService.transactionPaginationMeta;

  readonly amountRanges = computed<AmountRange[]>(() => {
    const sym = this.currencySymbol();
    return [
      { label: 'All Amounts', value: '' },
      { label: `${sym}0 – ${sym}10`, value: '0:10', min: 0, max: 10 },
      { label: `${sym}10 – ${sym}100`, value: '10:100', min: 10, max: 100 },
      { label: `${sym}100 – ${sym}500`, value: '100:500', min: 100, max: 500 },
      { label: `${sym}500 – ${sym}1,000`, value: '500:1000', min: 500, max: 1000 },
      { label: `${sym}1,000+`, value: '1000:', min: 1000 },
    ];
  });

  readonly pageNumbers = computed(() => {
    const { totalPages } = this.paginationMeta();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  });

  readonly rangeStart = computed(() => {
    const { page, limit, total } = this.paginationMeta();
    if (total === 0) return 0;
    return (page - 1) * limit + 1;
  });

  readonly rangeEnd = computed(() => {
    const { page, limit, total } = this.paginationMeta();
    return Math.min(page * limit, total);
  });

  readonly hasPrev = computed(() => this.paginationMeta().page > 1);
  readonly hasNext = computed(() => this.paginationMeta().page < this.paginationMeta().totalPages);

  readonly selectedAmountRange = computed(() => {
    const { amountMin, amountMax } = this.filterParams();
    if (amountMin == null && amountMax == null) return '';
    return `${amountMin ?? ''}:${amountMax ?? ''}`;
  });

  /**
   * Returns daisyUI badge CSS classes based on category name
   */
  getCategoryBadgeClass(categoryName: string | undefined): string {
    if (!categoryName) return 'badge-primary';

    const category = categoryName.toLowerCase();

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
    this.dataFlowService.openEditDrawer(transactionId);
  }

  onEdit(transactionId: string): void {
    this.dataFlowService.openEditDrawer(transactionId);
  }

  onDelete(transactionId: string): void {
    this.dataFlowService.openDeleteConfirm(transactionId);
  }

  onSearchChange(event: Event): void {
    const search = (event.target as HTMLInputElement).value.trim();
    this.dataFlowService.applyTransactionFilters({ search: search || undefined });
  }

  onTypeFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TransactionType | '';
    this.dataFlowService.applyTransactionFilters({ type: value || undefined });
  }

  onCategoryFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.dataFlowService.applyTransactionFilters({ categoryId: value || undefined });
  }

  onDateFromChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataFlowService.applyTransactionFilters({ dateFrom: value || undefined });
  }

  onDateToChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataFlowService.applyTransactionFilters({ dateTo: value || undefined });
  }

  onAmountRangeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (!value) {
      this.dataFlowService.applyTransactionFilters({ amountMin: undefined, amountMax: undefined });
      return;
    }
    const range = this.amountRanges().find(r => r.value === value);
    if (range) {
      this.dataFlowService.applyTransactionFilters({ amountMin: range.min, amountMax: range.max });
    }
  }

  resetFilters(): void {
    this.dataFlowService.resetTransactionFilters();
  }

  prevPage(): void {
    const { page } = this.paginationMeta();
    if (page > 1) {
      this.dataFlowService.goToTransactionPage(page - 1);
    }
  }

  nextPage(): void {
    const { page, totalPages } = this.paginationMeta();
    if (page < totalPages) {
      this.dataFlowService.goToTransactionPage(page + 1);
    }
  }

  goToPage(page: number): void {
    this.dataFlowService.goToTransactionPage(page);
  }
}
