import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, validateStandardSchema } from '@angular/forms/signals';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../../../app.constant';
import { BudgetFormModel, BudgetSchema, defaultBudgetFormModel } from '../../../budget-goal/budget-goal.model';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { ValidationService } from '../../../shared-services/validation.service';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [FormField, FormRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './budget-form.html',
})
export class BudgetForm {
  private dataFlowService = inject(DataFlowService);
  private validationService = inject(ValidationService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly formState = this.dataFlowService.budgetFormState;
  readonly categories = computed(() =>
    this.dataFlowService.categories().filter((category) => category.type === 'expense'),
  );
  readonly title = computed(() =>
    this.formState().mode === 'edit' ? this.text.BUDGET_EDIT_TITLE : this.text.BUDGET_ADD_TITLE,
  );

  budgetModel = signal<BudgetFormModel>(defaultBudgetFormModel);
  budgetForm: any;

  constructor() {
    this.budgetForm = form(
      this.budgetModel,
      (schemaPath) => {
        validateStandardSchema(schemaPath, BudgetSchema);
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
      this.budgetModel.set({ ...this.formState().values });
    });
  }

  close(): void {
    this.dataFlowService.closeBudgetDrawer();
  }

  onSubmit(): void {
    if (this.budgetForm().invalid()) {
      return;
    }

    const values = this.budgetForm().value() as BudgetFormModel;
    const validations = this.validationService.validateBudgetForm(values);
    const firstError = validations.find((item) => !item.isValid);

    if (firstError) {
      this.dataFlowService.setBudgetSubmitError(firstError.message ?? null);
      return;
    }

    this.dataFlowService.setBudgetSubmitting(true);
    this.dataFlowService.setBudgetSubmitError(null);

    const request = this.formState().mode === 'edit'
      ? this.dataFlowService.updateBudget(values)
      : this.dataFlowService.createBudget(values);

    request.subscribe({
      next: () => {
        this.dataFlowService.setBudgetSubmitting(false);
        this.dataFlowService.closeBudgetDrawer();
      },
      error: () => {
        this.dataFlowService.setBudgetSubmitting(false);
        this.dataFlowService.setBudgetSubmitError(APP_ERROR_MESSAGES.BUDGET.SAVE_FAILED);
      },
    });
  }
}