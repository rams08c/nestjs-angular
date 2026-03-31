import { APP_ERROR_MESSAGES } from '../app.constant';

type FeatureKey = keyof typeof APP_ERROR_MESSAGES;

/**
 * Get error message by feature and error key
 * @param feature - The feature module (AUTH, USERS, TRANSACTIONS)
 * @param errorKey - The error message key
 * @returns The corresponding error message
 */
export function getErrorMessage<F extends FeatureKey>(
  feature: F,
  errorKey: keyof typeof APP_ERROR_MESSAGES[F],
): string {
  return APP_ERROR_MESSAGES[feature][errorKey] as string;
}

/**
 * Helper for AUTH feature errors
 */
export const AuthErrors = {
  EMAIL_ALREADY_REGISTERED: () =>
    getErrorMessage('AUTH', 'EMAIL_ALREADY_REGISTERED' as const),
  INVALID_CREDENTIALS: () =>
    getErrorMessage('AUTH', 'INVALID_CREDENTIALS' as const),
};

/**
 * Helper for USERS feature errors
 */
export const UserErrors = {
  USER_NOT_FOUND: () =>
    getErrorMessage('USERS', 'USER_NOT_FOUND' as const),
  ACCESS_DENIED: () =>
    getErrorMessage('USERS', 'ACCESS_DENIED' as const),
};

/**
 * Helper for TRANSACTIONS feature errors
 */
export const TransactionErrors = {
  TRANSACTION_NOT_FOUND: () =>
    getErrorMessage('TRANSACTIONS', 'TRANSACTION_NOT_FOUND' as const),
  INVALID_TRANSACTION_ACCESS: () =>
    getErrorMessage('TRANSACTIONS', 'INVALID_TRANSACTION_ACCESS' as const),
  CATEGORY_NOT_FOUND: () =>
    getErrorMessage('TRANSACTIONS', 'CATEGORY_NOT_FOUND' as const),
  TYPE_CATEGORY_MISMATCH: () =>
    getErrorMessage('TRANSACTIONS', 'TYPE_CATEGORY_MISMATCH' as const),
};

/**
 * Helper for CATEGORIES feature errors
 */
export const CategoryErrors = {
  CATEGORY_NOT_FOUND: () =>
    getErrorMessage('CATEGORIES', 'CATEGORY_NOT_FOUND' as const),
  CATEGORY_ACCESS_FORBIDDEN: () =>
    getErrorMessage('CATEGORIES', 'CATEGORY_ACCESS_FORBIDDEN' as const),
  SYSTEM_CATEGORY_IMMUTABLE: () =>
    getErrorMessage('CATEGORIES', 'SYSTEM_CATEGORY_IMMUTABLE' as const),
  SYSTEM_CATEGORY_CREATION_FORBIDDEN: () =>
    getErrorMessage('CATEGORIES', 'SYSTEM_CATEGORY_CREATION_FORBIDDEN' as const),
  SYSTEM_FLAG_MUTATION_FORBIDDEN: () =>
    getErrorMessage('CATEGORIES', 'SYSTEM_FLAG_MUTATION_FORBIDDEN' as const),
};

/**
 * Helper for BUDGETS feature errors
 */
export const BudgetErrors = {
  BUDGET_NOT_FOUND: () =>
    getErrorMessage('BUDGETS', 'BUDGET_NOT_FOUND' as const),
  BUDGET_ACCESS_FORBIDDEN: () =>
    getErrorMessage('BUDGETS', 'BUDGET_ACCESS_FORBIDDEN' as const),
  BUDGET_CATEGORY_INVALID: () =>
    getErrorMessage('BUDGETS', 'BUDGET_CATEGORY_INVALID' as const),
};

/**
 * Helper for GOALS feature errors
 */
export const GoalErrors = {
  GOAL_NOT_FOUND: () =>
    getErrorMessage('GOALS', 'GOAL_NOT_FOUND' as const),
  GOAL_ACCESS_FORBIDDEN: () =>
    getErrorMessage('GOALS', 'GOAL_ACCESS_FORBIDDEN' as const),
  GOAL_SAVED_EXCEEDS_TARGET: () =>
    getErrorMessage('GOALS', 'GOAL_SAVED_EXCEEDS_TARGET' as const),
};

export const AccountErrors = {
  ACCOUNT_NOT_FOUND: () =>
    getErrorMessage('ACCOUNTS', 'ACCOUNT_NOT_FOUND' as const),
  ACCOUNT_ACCESS_FORBIDDEN: () =>
    getErrorMessage('ACCOUNTS', 'ACCOUNT_ACCESS_FORBIDDEN' as const),
  ACCOUNT_NAME_CONFLICT: () =>
    getErrorMessage('ACCOUNTS', 'ACCOUNT_NAME_CONFLICT' as const),
  ACCOUNT_HAS_TRANSACTIONS: () =>
    getErrorMessage('ACCOUNTS', 'ACCOUNT_HAS_TRANSACTIONS' as const),
};

export const SettingsErrors = {
  SETTINGS_NOT_FOUND: () =>
    getErrorMessage('SETTINGS', 'SETTINGS_NOT_FOUND' as const),
  SETTINGS_ACCESS_FORBIDDEN: () =>
    getErrorMessage('SETTINGS', 'SETTINGS_ACCESS_FORBIDDEN' as const),
};
