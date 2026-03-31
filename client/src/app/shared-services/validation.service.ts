import { Injectable } from '@angular/core';
import { APP_API_ENDPOINTS, APP_ERROR_MESSAGES, APP_VALIDATION } from '../app.constant';
import { validateHttp } from '@angular/forms/signals';

export interface ValidationResult {
  field: string;
  isValid: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private passwordRegex = APP_VALIDATION.PASSWORD_REGEX;

  validateEmail(email: string): ValidationResult {
    const trimmed = email?.trim() || '';
    if (!trimmed) {
      return { field: 'email', isValid: false, message: APP_ERROR_MESSAGES.AUTH.EMAIL_REQUIRED };
    }
    if (!this.emailRegex.test(trimmed)) {
      return { field: 'email', isValid: false, message: APP_ERROR_MESSAGES.AUTH.INVALID_EMAIL_FORMAT };
    }
    return { field: 'email', isValid: true };
  }

  validatePassword(password: string): ValidationResult {
    const trimmed = password || '';
    if (!trimmed) {
      return { field: 'password', isValid: false, message: APP_ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED };
    }
    if (trimmed.length < APP_VALIDATION.PASSWORD_MIN_LENGTH) {
      return { field: 'password', isValid: false, message: APP_ERROR_MESSAGES.AUTH.PASSWORD_MIN_LENGTH };
    }
    if (!/[A-Z]/.test(trimmed)) {
      return { field: 'password', isValid: false, message: APP_ERROR_MESSAGES.AUTH.PASSWORD_UPPERCASE_REQUIRED };
    }
    if (!/[a-z]/.test(trimmed)) {
      return { field: 'password', isValid: false, message: APP_ERROR_MESSAGES.AUTH.PASSWORD_LOWERCASE_REQUIRED };
    }
    if (!/\d/.test(trimmed)) {
      return { field: 'password', isValid: false, message: APP_ERROR_MESSAGES.AUTH.PASSWORD_NUMBER_REQUIRED };
    }
    if (!/[^A-Za-z\d]/.test(trimmed)) {
      return { field: 'password', isValid: false, message: APP_ERROR_MESSAGES.AUTH.PASSWORD_SPECIAL_REQUIRED };
    }
    if (!this.passwordRegex.test(trimmed)) {
      return { field: 'password', isValid: false, message: APP_ERROR_MESSAGES.AUTH.PASSWORD_COMPLEXITY };
    }
    return { field: 'password', isValid: true };
  }

  validateName(name: string): ValidationResult {
    const trimmed = name?.trim() || '';
    if (!trimmed) {
      return { field: 'name', isValid: false, message: APP_ERROR_MESSAGES.AUTH.NAME_REQUIRED };
    }
    if (trimmed.length < 2) {
      return { field: 'name', isValid: false, message: APP_ERROR_MESSAGES.AUTH.NAME_MIN_LENGTH };
    }
    return { field: 'name', isValid: true };
  }

  validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
    const pwd = password || '';
    const confirm = confirmPassword || '';
    if (!confirm) {
      return { field: 'confirmPassword', isValid: false, message: APP_ERROR_MESSAGES.AUTH.CONFIRM_PASSWORD_REQUIRED };
    }
    if (pwd !== confirm) {
      return { field: 'confirmPassword', isValid: false, message: APP_ERROR_MESSAGES.AUTH.PASSWORD_MISMATCH };
    }
    return { field: 'confirmPassword', isValid: true };
  }

  validateLoginForm(data: { email: string; password: string }): ValidationResult[] {
    return [this.validateEmail(data.email), this.validatePassword(data.password)];
  }

  validateRegisterForm(data: { name: string; email: string; password: string; confirmPassword: string }): ValidationResult[] {
    return [
      this.validateName(data.name),
      this.validateEmail(data.email),
      this.validatePassword(data.password),
      this.validateConfirmPassword(data.password, data.confirmPassword),
    ];
  }

  validateTransactionAmount(amount: string): ValidationResult {
    const trimmed = (amount || '').trim();
    if (!trimmed) {
      return { field: 'amount', isValid: false, message: APP_ERROR_MESSAGES.TRANSACTION.AMOUNT_REQUIRED };
    }

    const numericAmount = Number(trimmed);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return { field: 'amount', isValid: false, message: APP_ERROR_MESSAGES.TRANSACTION.AMOUNT_POSITIVE };
    }

    return { field: 'amount', isValid: true };
  }

  validateTransactionCategory(categoryId: string): ValidationResult {
    const trimmed = (categoryId || '').trim();
    if (!trimmed) {
      return { field: 'categoryId', isValid: false, message: APP_ERROR_MESSAGES.TRANSACTION.CATEGORY_REQUIRED };
    }
    return { field: 'categoryId', isValid: true };
  }

  validateTransactionDate(date: string): ValidationResult {
    const trimmed = (date || '').trim();
    if (!trimmed) {
      return { field: 'date', isValid: false, message: APP_ERROR_MESSAGES.TRANSACTION.DATE_REQUIRED };
    }
    if (Number.isNaN(Date.parse(trimmed))) {
      return { field: 'date', isValid: false, message: APP_ERROR_MESSAGES.TRANSACTION.DATE_INVALID };
    }
    return { field: 'date', isValid: true };
  }

  validateTransactionForm(data: { amount: string; categoryId: string; date: string }): ValidationResult[] {
    return [
      this.validateTransactionAmount(data.amount),
      this.validateTransactionCategory(data.categoryId),
      this.validateTransactionDate(data.date),
    ];
  }

  validateBudgetCategory(categoryId: string): ValidationResult {
    const trimmed = (categoryId || '').trim();
    if (!trimmed) {
      return { field: 'categoryId', isValid: false, message: APP_ERROR_MESSAGES.BUDGET.CATEGORY_REQUIRED };
    }
    return { field: 'categoryId', isValid: true };
  }

  validateBudgetLimit(limitAmount: string): ValidationResult {
    const trimmed = (limitAmount || '').trim();
    if (!trimmed) {
      return { field: 'limitAmount', isValid: false, message: APP_ERROR_MESSAGES.BUDGET.LIMIT_REQUIRED };
    }

    const numericAmount = Number(trimmed);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return { field: 'limitAmount', isValid: false, message: APP_ERROR_MESSAGES.BUDGET.LIMIT_POSITIVE };
    }

    return { field: 'limitAmount', isValid: true };
  }

  validateBudgetPeriod(period: string): ValidationResult {
    const trimmed = (period || '').trim();
    if (!trimmed) {
      return { field: 'period', isValid: false, message: APP_ERROR_MESSAGES.BUDGET.PERIOD_REQUIRED };
    }
    return { field: 'period', isValid: true };
  }

  validateBudgetForm(data: { categoryId: string; limitAmount: string; period: string }): ValidationResult[] {
    return [
      this.validateBudgetCategory(data.categoryId),
      this.validateBudgetLimit(data.limitAmount),
      this.validateBudgetPeriod(data.period),
    ];
  }

  validateGoalName(name: string): ValidationResult {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return { field: 'name', isValid: false, message: APP_ERROR_MESSAGES.GOAL.NAME_REQUIRED };
    }
    return { field: 'name', isValid: true };
  }

  validateGoalTargetAmount(targetAmount: string): ValidationResult {
    const trimmed = (targetAmount || '').trim();
    if (!trimmed) {
      return { field: 'targetAmount', isValid: false, message: APP_ERROR_MESSAGES.GOAL.TARGET_REQUIRED };
    }

    const numericAmount = Number(trimmed);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return { field: 'targetAmount', isValid: false, message: APP_ERROR_MESSAGES.GOAL.TARGET_POSITIVE };
    }

    return { field: 'targetAmount', isValid: true };
  }

  validateGoalSavedAmount(savedAmount: string, targetAmount?: string): ValidationResult {
    const trimmed = (savedAmount || '').trim();
    if (!trimmed) {
      return { field: 'savedAmount', isValid: false, message: APP_ERROR_MESSAGES.GOAL.SAVED_REQUIRED };
    }

    const numericAmount = Number(trimmed);
    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      return { field: 'savedAmount', isValid: false, message: APP_ERROR_MESSAGES.GOAL.SAVED_NON_NEGATIVE };
    }

    if (targetAmount && Number.isFinite(Number(targetAmount)) && numericAmount > Number(targetAmount)) {
      return { field: 'savedAmount', isValid: false, message: APP_ERROR_MESSAGES.GOAL.SAVED_EXCEEDS_TARGET };
    }

    return { field: 'savedAmount', isValid: true };
  }

  validateGoalTargetDate(targetDate: string): ValidationResult {
    const trimmed = (targetDate || '').trim();
    if (!trimmed) {
      return { field: 'targetDate', isValid: false, message: APP_ERROR_MESSAGES.GOAL.TARGET_DATE_REQUIRED };
    }

    if (Number.isNaN(Date.parse(trimmed))) {
      return { field: 'targetDate', isValid: false, message: APP_ERROR_MESSAGES.GOAL.TARGET_DATE_INVALID };
    }

    return { field: 'targetDate', isValid: true };
  }

  validateGoalForm(data: { name: string; targetAmount: string; savedAmount: string; targetDate: string }): ValidationResult[] {
    return [
      this.validateGoalName(data.name),
      this.validateGoalTargetAmount(data.targetAmount),
      this.validateGoalSavedAmount(data.savedAmount, data.targetAmount),
      this.validateGoalTargetDate(data.targetDate),
    ];
  }

  isFormValid(errors: ValidationResult[]): boolean {
    return errors.every((error) => error.isValid);
  }

  validateAccountName(name: string): ValidationResult {
    const trimmed = (name || '').trim();
    if (!trimmed) return { field: 'name', isValid: false, message: APP_ERROR_MESSAGES.ACCOUNT.NAME_REQUIRED };
    if (trimmed.length > 100) return { field: 'name', isValid: false, message: APP_ERROR_MESSAGES.ACCOUNT.NAME_MAX };
    return { field: 'name', isValid: true };
  }

  validateAccountType(type: string): ValidationResult {
    if (!type) return { field: 'type', isValid: false, message: APP_ERROR_MESSAGES.ACCOUNT.TYPE_REQUIRED };
    if (!['cash', 'bank', 'card'].includes(type)) return { field: 'type', isValid: false, message: APP_ERROR_MESSAGES.ACCOUNT.TYPE_INVALID };
    return { field: 'type', isValid: true };
  }

  validateAccountBalance(balance: string): ValidationResult {
    const trimmed = (balance || '').trim();
    if (!trimmed) return { field: 'balance', isValid: false, message: APP_ERROR_MESSAGES.ACCOUNT.BALANCE_REQUIRED };
    if (!Number.isFinite(Number(trimmed))) return { field: 'balance', isValid: false, message: APP_ERROR_MESSAGES.ACCOUNT.BALANCE_VALID };
    return { field: 'balance', isValid: true };
  }

  validateAccountForm(data: { name: string; type: string; balance: string }): ValidationResult[] {
    return [
      this.validateAccountName(data.name),
      this.validateAccountType(data.type),
      this.validateAccountBalance(data.balance),
    ];
  }

  checkEmailAvailability(schemaPath: any) {
    validateHttp(schemaPath.email, {
      request: ({ value }) => `${APP_API_ENDPOINTS.AUTH.CHECK_EMAIL}?email=${value()}`,
      onSuccess: (response: any) => {
        if (!response.available) {
          return { kind: 'emailTaken', message: APP_ERROR_MESSAGES.AUTH.EMAIL_ALREADY_TAKEN };
        }
        return null;
      },
      onError: () => ({
        kind: 'networkError',
        message: APP_ERROR_MESSAGES.AUTH.EMAIL_AVAILABILITY_CHECK_FAILED,
      }),
    });
  }
}
