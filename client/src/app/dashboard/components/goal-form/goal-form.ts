import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, validateStandardSchema } from '@angular/forms/signals';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../../../app.constant';
import { defaultGoalFormModel, GoalFormModel, GoalSchema } from '../../../budget-goal/budget-goal.model';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { ValidationService } from '../../../shared-services/validation.service';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [FormField, FormRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './goal-form.html',
})
export class GoalForm {
  private dataFlowService = inject(DataFlowService);
  private validationService = inject(ValidationService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly formState = this.dataFlowService.goalFormState;
  readonly title = computed(() =>
    this.formState().mode === 'edit' ? this.text.GOAL_EDIT_TITLE : this.text.GOAL_ADD_TITLE,
  );

  goalModel = signal<GoalFormModel>(defaultGoalFormModel);
  goalForm: any;

  constructor() {
    this.goalForm = form(
      this.goalModel,
      (schemaPath) => {
        validateStandardSchema(schemaPath, GoalSchema);
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
      this.goalModel.set({ ...this.formState().values });
    });
  }

  close(): void {
    this.dataFlowService.closeGoalDrawer();
  }

  onSubmit(): void {
    if (this.goalForm().invalid()) {
      return;
    }

    const values = this.goalForm().value() as GoalFormModel;
    const validations = this.validationService.validateGoalForm(values);
    const firstError = validations.find((item) => !item.isValid);

    if (firstError) {
      this.dataFlowService.setGoalSubmitError(firstError.message ?? null);
      return;
    }

    this.dataFlowService.setGoalSubmitting(true);
    this.dataFlowService.setGoalSubmitError(null);

    const request = this.formState().mode === 'edit'
      ? this.dataFlowService.updateGoal(values)
      : this.dataFlowService.createGoal(values);

    request.subscribe({
      next: () => {
        this.dataFlowService.setGoalSubmitting(false);
        this.dataFlowService.closeGoalDrawer();
      },
      error: () => {
        this.dataFlowService.setGoalSubmitting(false);
        this.dataFlowService.setGoalSubmitError(APP_ERROR_MESSAGES.GOAL.SAVE_FAILED);
      },
    });
  }
}