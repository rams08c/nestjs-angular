import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormField, FormRoot, form, validateStandardSchema } from '@angular/forms/signals';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../../../app.constant';
import {
  AccountFormModel,
  AccountItem,
  AccountSchema,
  defaultAccountFormModel,
} from '../../../account-settings/account.model';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { ValidationService } from '../../../shared-services/validation.service';

@Component({
  selector: 'app-account-panel',
  imports: [DecimalPipe, FormField, FormRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-panel.html',
})
export class AccountPanel implements OnInit {
  private dataFlowService = inject(DataFlowService);
  private validationService = inject(ValidationService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly accounts = computed(() => this.dataFlowService.accounts());
  readonly formState = this.dataFlowService.accountFormState;
  readonly currencySymbol = this.dataFlowService.currencySymbol;
  readonly title = computed(() =>
    this.formState().mode === 'edit' ? this.text.ACCOUNT_EDIT_TITLE : this.text.ACCOUNT_ADD_TITLE,
  );
  readonly accountTypes: Array<{ value: string; label: string }> = [
    { value: 'cash', label: this.text.ACCOUNT_TYPE_CASH },
    { value: 'bank', label: this.text.ACCOUNT_TYPE_BANK },
    { value: 'card', label: this.text.ACCOUNT_TYPE_CARD },
  ];

  deletingId = signal<string | null>(null);
  deleteError = signal<string | null>(null);

  accountModel = signal<AccountFormModel>(defaultAccountFormModel);
  accountForm: any;

  constructor() {
    this.accountForm = form(
      this.accountModel,
      (schemaPath) => {
        validateStandardSchema(schemaPath, AccountSchema);
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
      this.accountModel.set({ ...this.formState().values });
    });
  }

  ngOnInit(): void {
    this.dataFlowService.loadAccounts();
  }

  openAdd(): void {
    this.dataFlowService.openAddAccountDrawer();
  }

  openEdit(account: AccountItem): void {
    this.dataFlowService.openEditAccountDrawer(account);
  }

  close(): void {
    this.dataFlowService.closeAccountDrawer();
  }

  onSubmit(): void {
    if (this.accountForm().invalid()) return;

    const values = this.accountForm().value() as AccountFormModel;
    const errors = this.validationService.validateAccountForm(values);
    const firstError = errors.find((e) => !e.isValid);
    if (firstError) {
      this.dataFlowService.setAccountSubmitError(firstError.message ?? null);
      return;
    }

    this.dataFlowService.setAccountSubmitting(true);
    this.dataFlowService.setAccountSubmitError(null);

    const request =
      this.formState().mode === 'edit'
        ? this.dataFlowService.updateAccount(values)
        : this.dataFlowService.createAccount(values);

    request.subscribe({
      next: () => {
        this.dataFlowService.setAccountSubmitting(false);
        this.dataFlowService.closeAccountDrawer();
      },
      error: () => {
        this.dataFlowService.setAccountSubmitting(false);
        this.dataFlowService.setAccountSubmitError(APP_ERROR_MESSAGES.ACCOUNT.SAVE_FAILED);
      },
    });
  }

  onDelete(id: string): void {
    this.deletingId.set(id);
    this.deleteError.set(null);
    this.dataFlowService.deleteAccount(id).subscribe({
      next: () => this.deletingId.set(null),
      error: () => {
        this.deletingId.set(null);
        this.deleteError.set(APP_ERROR_MESSAGES.ACCOUNT.DELETE_FAILED);
      },
    });
  }
}
