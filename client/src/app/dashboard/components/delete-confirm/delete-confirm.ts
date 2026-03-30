import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../../../app.constant';
import { DataFlowService } from '../../../shared-services/data-flow.service';

@Component({
  selector: 'app-delete-confirm',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-confirm.html',
})
export class DeleteConfirm {
  private dataFlowService = inject(DataFlowService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly deleteState = this.dataFlowService.deleteConfirmState;

  readonly targetTransaction = computed(() => {
    const id = this.deleteState().targetTransactionId;
    if (!id) {
      return undefined;
    }

    const transaction = this.dataFlowService.getTransactionById(id);
    if (!transaction) {
      return undefined;
    }

    return {
      ...transaction,
      categoryName:
        this.dataFlowService.getCategoryById(transaction.categoryId)?.name ?? transaction.categoryId,
    };
  });

  close(): void {
    this.dataFlowService.closeDeleteConfirm();
  }

  confirm(): void {
    this.dataFlowService.confirmDelete().subscribe({
      error: () => {
        this.dataFlowService.setTransactionSubmitError(APP_ERROR_MESSAGES.TRANSACTION.DELETE_FAILED);
      },
    });
  }
}
