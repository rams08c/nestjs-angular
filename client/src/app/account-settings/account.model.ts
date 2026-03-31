import { computed } from '@angular/core';
import * as z from 'zod';
import { APP_ERROR_MESSAGES } from '../app.constant';
import { EntityFormState } from '../budget-goal/budget-goal.model';

export type AccountType = 'cash' | 'bank' | 'card';

export interface AccountItem {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AccountFormModel {
  name: string;
  type: AccountType | '';
  balance: string;
}

export const defaultAccountFormModel: AccountFormModel = {
  name: '',
  type: '',
  balance: '',
};

export const defaultAccountFormState: EntityFormState<AccountFormModel> = {
  mode: 'add',
  isOpen: false,
  isSubmitting: false,
  submitError: null,
  editingId: null,
  values: { ...defaultAccountFormModel },
};

export const AccountSchema = computed(() =>
  z.object({
    name: z
      .string()
      .min(1, { message: APP_ERROR_MESSAGES.ACCOUNT.NAME_REQUIRED })
      .max(100, { message: APP_ERROR_MESSAGES.ACCOUNT.NAME_MAX }),
    type: z.enum(['cash', 'bank', 'card'] as const, {
      error: () => APP_ERROR_MESSAGES.ACCOUNT.TYPE_REQUIRED,
    }),
    balance: z
      .string()
      .min(1, { message: APP_ERROR_MESSAGES.ACCOUNT.BALANCE_REQUIRED })
      .refine((v) => Number.isFinite(Number(v)), {
        message: APP_ERROR_MESSAGES.ACCOUNT.BALANCE_VALID,
      }),
  }),
);
