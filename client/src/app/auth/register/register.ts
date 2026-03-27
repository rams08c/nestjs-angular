import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { ValidationService, ValidationResult } from '../services/validation.service';
import { DataFlowService } from '../services/data-flow.service';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  redirect?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private validationService = inject(ValidationService);
  private dataFlowService = inject(DataFlowService);

  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  formErrors = signal<ValidationResult[]>([]);
  isFormValid = computed(() => this.validationService.isFormValid(this.formErrors()));

  ngOnInit(): void {
    // Check if already logged in
    if (this.dataFlowService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onNameChange(value: string): void {
    this.name.set(value);
    this.validateFormRealTime();
  }

  onEmailChange(value: string): void {
    this.email.set(value);
    this.validateFormRealTime();
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    this.validateFormRealTime();
  }

  onConfirmPasswordChange(value: string): void {
    this.confirmPassword.set(value);
    this.validateFormRealTime();
  }

  private validateFormRealTime(): void {
    const errors = this.validationService.validateRegisterForm({
      name: this.name(),
      email: this.email(),
      password: this.password(),
      confirmPassword: this.confirmPassword(),
    });
    this.formErrors.set(errors);
  }

  onSubmit(): void {
    // Final validation
    const errors = this.validationService.validateRegisterForm({
      name: this.name(),
      email: this.email(),
      password: this.password(),
      confirmPassword: this.confirmPassword(),
    });

    if (!this.validationService.isFormValid(errors)) {
      this.formErrors.set(errors);
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const registerRequest: RegisterRequest = {
      name: this.name(),
      email: this.email(),
      password: this.password(),
    };

    this.http.post<RegisterResponse>('/api/auth/register', registerRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        if (error.error?.error) {
          this.submitError.set(error.error.error);
        } else {
          this.submitError.set('Registration failed. Please try again.');
        }
      },
    });
  }

  getFieldError(fieldName: string): string | undefined {
    const error = this.formErrors().find((e) => e.field === fieldName);
    return error?.message;
  }

  isFieldInvalid(fieldName: string): boolean {
    const error = this.formErrors().find((e) => e.field === fieldName);
    return error ? !error.isValid : false;
  }
}
