import { computed } from '@angular/core';
import * as z from 'zod';
import { APP_ERROR_MESSAGES } from '../app.constant';

export type BudgetPeriod = 'monthly';

export interface BudgetItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  limitAmount: number;
  period: BudgetPeriod;
  usedAmount: number;
  remainingAmount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoalItem {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
  remainingAmount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetFormModel {
  categoryId: string;
  limitAmount: string;
  period: BudgetPeriod;
}

export interface GoalFormModel {
  name: string;
  targetAmount: string;
  savedAmount: string;
  targetDate: string;
}

export interface EntityFormState<TValues> {
  mode: 'add' | 'edit';
  isOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  editingId: string | null;
  values: TValues;
}

export const defaultBudgetFormModel: BudgetFormModel = {
  categoryId: '',
  limitAmount: '',
  period: 'monthly',
};

export const defaultGoalFormModel: GoalFormModel = {
  name: '',
  targetAmount: '',
  savedAmount: '0',
  targetDate: '',
};

export const defaultBudgetFormState: EntityFormState<BudgetFormModel> = {
  mode: 'add',
  isOpen: false,
  isSubmitting: false,
  submitError: null,
  editingId: null,
  values: { ...defaultBudgetFormModel },
};

export const defaultGoalFormState: EntityFormState<GoalFormModel> = {
  mode: 'add',
  isOpen: false,
  isSubmitting: false,
  submitError: null,
  editingId: null,
  values: { ...defaultGoalFormModel },
};

export const BudgetSchema = computed(() =>
  z.object({
    categoryId: z.string().min(1, { message: APP_ERROR_MESSAGES.BUDGET.CATEGORY_REQUIRED }),
    limitAmount: z
      .string()
      .min(1, { message: APP_ERROR_MESSAGES.BUDGET.LIMIT_REQUIRED })
      .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
        message: APP_ERROR_MESSAGES.BUDGET.LIMIT_POSITIVE,
      }),
    period: z.string().min(1, { message: APP_ERROR_MESSAGES.BUDGET.PERIOD_REQUIRED }),
  }),
);

export const GoalSchema = computed(() =>
  z
    .object({
      name: z.string().min(1, { message: APP_ERROR_MESSAGES.GOAL.NAME_REQUIRED }),
      targetAmount: z
        .string()
        .min(1, { message: APP_ERROR_MESSAGES.GOAL.TARGET_REQUIRED })
        .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
          message: APP_ERROR_MESSAGES.GOAL.TARGET_POSITIVE,
        }),
      savedAmount: z
        .string()
        .min(1, { message: APP_ERROR_MESSAGES.GOAL.SAVED_REQUIRED })
        .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, {
          message: APP_ERROR_MESSAGES.GOAL.SAVED_NON_NEGATIVE,
        }),
      targetDate: z
        .string()
        .min(1, { message: APP_ERROR_MESSAGES.GOAL.TARGET_DATE_REQUIRED })
        .refine((value) => !Number.isNaN(Date.parse(value)), {
          message: APP_ERROR_MESSAGES.GOAL.TARGET_DATE_INVALID,
        }),
    })
    .refine((data) => Number(data.savedAmount) <= Number(data.targetAmount), {
      message: APP_ERROR_MESSAGES.GOAL.SAVED_EXCEEDS_TARGET,
      path: ['savedAmount'],
    }),
);