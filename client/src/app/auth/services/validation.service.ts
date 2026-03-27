import { Injectable } from '@angular/core';

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
  private passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  validateEmail(email: string): ValidationResult {
    const trimmed = email?.trim() || '';
    if (!trimmed) {
      return { field: 'email', isValid: false, message: 'Email is required' };
    }
    if (!this.emailRegex.test(trimmed)) {
      return { field: 'email', isValid: false, message: 'Invalid email format' };
    }
    return { field: 'email', isValid: true };
  }

  validatePassword(password: string): ValidationResult {
    const trimmed = password || '';
    if (!trimmed) {
      return { field: 'password', isValid: false, message: 'Password is required' };
    }
    if (trimmed.length < 6) {
      return { field: 'password', isValid: false, message: 'Password must be at least 6 characters' };
    }
    if (!/[A-Z]/.test(trimmed)) {
      return { field: 'password', isValid: false, message: 'Password must contain at least 1 uppercase letter' };
    }
    if (!/\d/.test(trimmed)) {
      return { field: 'password', isValid: false, message: 'Password must contain at least 1 number' };
    }
    return { field: 'password', isValid: true };
  }

  validateName(name: string): ValidationResult {
    const trimmed = name?.trim() || '';
    if (!trimmed) {
      return { field: 'name', isValid: false, message: 'Name is required' };
    }
    if (trimmed.length < 2) {
      return { field: 'name', isValid: false, message: 'Name must be at least 2 characters' };
    }
    return { field: 'name', isValid: true };
  }

  validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
    const pwd = password || '';
    const confirm = confirmPassword || '';
    if (!confirm) {
      return { field: 'confirmPassword', isValid: false, message: 'Confirm password is required' };
    }
    if (pwd !== confirm) {
      return { field: 'confirmPassword', isValid: false, message: 'Passwords do not match' };
    }
    return { field: 'confirmPassword', isValid: true };
  }

  validateLoginForm(data: { email: string; password: string }): ValidationResult[] {
    const errors: ValidationResult[] = [];
    errors.push(this.validateEmail(data.email));
    errors.push(this.validatePassword(data.password));
    return errors;
  }

  validateRegisterForm(data: { name: string; email: string; password: string; confirmPassword: string }): ValidationResult[] {
    const errors: ValidationResult[] = [];
    errors.push(this.validateName(data.name));
    errors.push(this.validateEmail(data.email));
    errors.push(this.validatePassword(data.password));
    errors.push(this.validateConfirmPassword(data.password, data.confirmPassword));
    return errors;
  }

  isFormValid(errors: ValidationResult[]): boolean {
    return errors.every((error) => error.isValid);
  }
}
