import { computed } from '@angular/core';
import * as z from 'zod';
import { APP_ERROR_MESSAGES } from '../../../app.constant';

export type TransactionType = 'expense' | 'income';

export interface TransactionCategory {
  id: string;
  name: string;
  type: TransactionType;
  isSystem: boolean;
  ownerUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItem {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName?: string;
  date: string;
  description: string | null;
  userId: string;
  groupId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormModel {
  amount: string;
  categoryId: string;
  date: string;
  description: string;
}

export interface TransactionFormState {
  mode: 'add' | 'edit';
  isOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  editingTransactionId: string | null;
  values: TransactionFormModel;
}

export interface DeleteConfirmState {
  isOpen: boolean;
  targetTransactionId: string | null;
}

export const defaultTransactionFormModel: TransactionFormModel = {
  amount: '',
  categoryId: '',
  date: '',
  description: '',
};

export const defaultTransactionFormState: TransactionFormState = {
  mode: 'add',
  isOpen: false,
  isSubmitting: false,
  submitError: null,
  editingTransactionId: null,
  values: { ...defaultTransactionFormModel },
};

export const defaultDeleteConfirmState: DeleteConfirmState = {
  isOpen: false,
  targetTransactionId: null,
};

export const TransactionSchema = computed(() =>
  z.object({
    amount: z
      .string()
      .min(1, { message: APP_ERROR_MESSAGES.TRANSACTION.AMOUNT_REQUIRED })
      .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
        message: APP_ERROR_MESSAGES.TRANSACTION.AMOUNT_POSITIVE,
      }),
    categoryId: z.string().min(1, { message: APP_ERROR_MESSAGES.TRANSACTION.CATEGORY_REQUIRED }),
    date: z
      .string()
      .min(1, { message: APP_ERROR_MESSAGES.TRANSACTION.DATE_REQUIRED })
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: APP_ERROR_MESSAGES.TRANSACTION.DATE_INVALID,
      }),
    description: z.string().optional(),
  }),
);
