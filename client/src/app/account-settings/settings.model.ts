import { computed } from '@angular/core';
import * as z from 'zod';
import { APP_ERROR_MESSAGES } from '../app.constant';
import { EntityFormState } from '../budget-goal/budget-goal.model';

export interface SettingsFormModel {
  firstName: string;
  lastName: string;
  location: string;
  address: string;
  country: string;
}

export const defaultSettingsFormModel: SettingsFormModel = {
  firstName: '',
  lastName: '',
  location: '',
  address: '',
  country: '',
};

export const defaultSettingsFormState: EntityFormState<SettingsFormModel> = {
  mode: 'edit',
  isOpen: false,
  isSubmitting: false,
  submitError: null,
  editingId: null,
  values: { ...defaultSettingsFormModel },
};

export const SettingsSchema = computed(() =>
  z.object({
    firstName: z.string().max(80, { message: APP_ERROR_MESSAGES.SETTINGS.FIRST_NAME_MAX }).optional(),
    lastName: z.string().max(80, { message: APP_ERROR_MESSAGES.SETTINGS.LAST_NAME_MAX }).optional(),
    location: z.string().max(120, { message: APP_ERROR_MESSAGES.SETTINGS.LOCATION_MAX }).optional(),
    address: z.string().max(255, { message: APP_ERROR_MESSAGES.SETTINGS.ADDRESS_MAX }).optional(),
    country: z.string().max(100, { message: APP_ERROR_MESSAGES.SETTINGS.COUNTRY_MAX }).optional(),
  }),
);
