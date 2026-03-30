import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, validateStandardSchema } from '@angular/forms/signals';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../../../app.constant';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { ValidationService } from '../../../shared-services/validation.service';
import {
  defaultTransactionFormModel,
  TransactionFormModel,
  TransactionSchema,
} from '../../transaction.model';

@Component({
  selector: 'app-transaction-form',
  imports: [FormField, FormRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-form.html',
})
export class TransactionForm {
  private dataFlowService = inject(DataFlowService);
  private validationService = inject(ValidationService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly formState = this.dataFlowService.transactionFormState;
  readonly categories = this.dataFlowService.categories;
  readonly loadingCategories = this.dataFlowService.loadingCategories;

  transactionModel = signal<TransactionFormModel>(defaultTransactionFormModel);
  transactionForm: any;

  readonly title = computed(() =>
    this.formState().mode === 'edit' ? this.text.TRANSACTION_EDIT_TITLE : this.text.TRANSACTION_ADD_TITLE,
  );

  constructor() {
    this.transactionForm = form(
      this.transactionModel,
      (schemaPath) => {
        validateStandardSchema(schemaPath, TransactionSchema);
      },
      {
        submission: {
          action: async () => {
            this.onSubmit();
          },
        },
      },
    );

    effect(() => {
      const values = this.formState().values;
      this.transactionModel.set({ ...values });
    });
  }

  close(): void {
    this.dataFlowService.closeDrawer();
  }

  onSubmit(): void {
    if (this.transactionForm().invalid()) {
      return;
    }

    const values = this.transactionForm().value() as TransactionFormModel;
    const validations = this.validationService.validateTransactionForm(values);
    const firstError = validations.find((item) => !item.isValid);

    if (firstError) {
      this.dataFlowService.setTransactionSubmitError(firstError.message ?? null);
      return;
    }

    this.dataFlowService.setTransactionSubmitting(true);
    this.dataFlowService.setTransactionSubmitError(null);

    if (this.formState().mode === 'edit') {
      this.dataFlowService.updateTransaction(values).subscribe({
        next: () => {
          this.dataFlowService.setTransactionSubmitting(false);
          this.dataFlowService.closeDrawer();
        },
        error: () => {
          this.dataFlowService.setTransactionSubmitting(false);
          this.dataFlowService.setTransactionSubmitError(APP_ERROR_MESSAGES.TRANSACTION.SAVE_FAILED);
        },
      });
    } else {
      this.dataFlowService.createTransaction(values).subscribe({
        next: () => {
          this.dataFlowService.setTransactionSubmitting(false);
          this.dataFlowService.closeDrawer();
        },
        error: () => {
          this.dataFlowService.setTransactionSubmitting(false);
          this.dataFlowService.setTransactionSubmitError(APP_ERROR_MESSAGES.TRANSACTION.SAVE_FAILED);
        },
      });
    }
  }
}
