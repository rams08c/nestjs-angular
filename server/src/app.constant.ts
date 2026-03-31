export const APP_ERROR_MESSAGES = {
  AUTH: {
    EMAIL_ALREADY_REGISTERED: 'Email is already registered',
    INVALID_CREDENTIALS: 'Invalid credentials',
  },
  USERS: {
    USER_NOT_FOUND: 'User not found',
    ACCESS_DENIED: 'Access denied',
  },
  TRANSACTIONS: {
    TRANSACTION_NOT_FOUND: 'Transaction not found',
    INVALID_TRANSACTION_ACCESS: 'Invalid transaction access',
    CATEGORY_NOT_FOUND: 'Category not found for this user',
    TYPE_CATEGORY_MISMATCH: 'Transaction type does not match category type',
  },
  CATEGORIES: {
    CATEGORY_NOT_FOUND: 'Category not found',
    CATEGORY_ACCESS_FORBIDDEN: 'Category access is forbidden',
    SYSTEM_CATEGORY_IMMUTABLE: 'System category cannot be modified or deleted',
    SYSTEM_CATEGORY_CREATION_FORBIDDEN: 'System category creation is not allowed',
    SYSTEM_FLAG_MUTATION_FORBIDDEN: 'isSystem field cannot be changed',
  },
  BUDGETS: {
    BUDGET_NOT_FOUND: 'Budget not found',
    BUDGET_ACCESS_FORBIDDEN: 'Budget access is forbidden',
    BUDGET_CATEGORY_INVALID: 'Budget category must be an expense category',
  },
  GOALS: {
    GOAL_NOT_FOUND: 'Goal not found',
    GOAL_ACCESS_FORBIDDEN: 'Goal access is forbidden',
    GOAL_SAVED_EXCEEDS_TARGET: 'Saved amount cannot exceed target amount',
  },
} as const;
