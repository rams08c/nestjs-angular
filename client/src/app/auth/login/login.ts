import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { ValidationService, ValidationResult } from '../services/validation.service';
import { DataFlowService } from '../services/data-flow.service';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private validationService = inject(ValidationService);
  private dataFlowService = inject(DataFlowService);

  email = signal('');
  password = signal('');
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

  onEmailChange(value: string): void {
    this.email.set(value);
    this.validateFormRealTime();
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    this.validateFormRealTime();
  }

  private validateFormRealTime(): void {
    const errors = this.validationService.validateLoginForm({
      email: this.email(),
      password: this.password(),
    });
    this.formErrors.set(errors);
  }

  onSubmit(): void {
    // Final validation
    const errors = this.validationService.validateLoginForm({
      email: this.email(),
      password: this.password(),
    });

    if (!this.validationService.isFormValid(errors)) {
      this.formErrors.set(errors);
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const loginRequest: LoginRequest = {
      email: this.email(),
      password: this.password(),
    };

    this.http.post<LoginResponse>('/api/auth/login', loginRequest).subscribe({
      next: (response) => {
        this.dataFlowService.loginUser(response.user, response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        if (error.error?.error) {
          this.submitError.set(error.error.error);
        } else {
          this.submitError.set('Login failed. Please try again.');
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
