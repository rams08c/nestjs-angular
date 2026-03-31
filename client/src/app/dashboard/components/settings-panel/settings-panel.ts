import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormField, FormRoot, form, validateStandardSchema } from '@angular/forms/signals';
import { APP_ERROR_MESSAGES, APP_TEXT } from '../../../app.constant';
import { COUNTRIES } from '../../../app.countries';
import {
  defaultSettingsFormModel,
  SettingsFormModel,
  SettingsSchema,
} from '../../../account-settings/settings.model';
import { DataFlowService } from '../../../shared-services/data-flow.service';

@Component({
  selector: 'app-settings-panel',
  imports: [FormField, FormRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-panel.html',
})
export class SettingsPanel implements OnInit {
  private dataFlowService = inject(DataFlowService);

  readonly text = APP_TEXT.DASHBOARD;
  readonly countries = COUNTRIES;
  readonly formState = this.dataFlowService.settingsFormState;

  isEditing = signal(false);
  settingsModel = signal<SettingsFormModel>(defaultSettingsFormModel);
  saveSuccess = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settingsForm: any;

  constructor() {
    this.settingsForm = form(
      this.settingsModel,
      (schemaPath) => {
        validateStandardSchema(schemaPath, SettingsSchema);
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
      const current = this.dataFlowService.settings();
      if (current) {
        this.settingsModel.set({ ...current });
      }
    });
  }

  ngOnInit(): void {
    this.dataFlowService.loadSettings();
  }

  get hasProfile(): boolean {
    const s = this.dataFlowService.settings();
    return !!(s?.firstName || s?.lastName || s?.location || s?.address || s?.country);
  }

  startEdit(): void {
    const current = this.dataFlowService.settings();
    if (current) this.settingsModel.set({ ...current });
    this.saveSuccess.set(false);
    this.dataFlowService.setSettingsSubmitError(null);
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    const current = this.dataFlowService.settings();
    if (current) this.settingsModel.set({ ...current });
    this.isEditing.set(false);
  }

  onSubmit(): void {
    if (this.settingsForm().invalid()) return;

    const values = this.settingsForm().value() as SettingsFormModel;
    this.dataFlowService.setSettingsSubmitting(true);
    this.dataFlowService.setSettingsSubmitError(null);
    this.saveSuccess.set(false);

    this.dataFlowService.saveSettings(values).subscribe({
      next: () => {
        this.dataFlowService.setSettingsSubmitting(false);
        this.saveSuccess.set(true);
        this.isEditing.set(false);
      },
      error: () => {
        this.dataFlowService.setSettingsSubmitting(false);
        this.dataFlowService.setSettingsSubmitError(APP_ERROR_MESSAGES.SETTINGS.SAVE_FAILED);
      },
    });
  }

  countryName(code: string): string {
    return COUNTRIES.find((c) => c.code === code)?.name ?? code;
  }
}
