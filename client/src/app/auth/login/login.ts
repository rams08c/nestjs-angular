import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField, FormRoot, form, validateStandardSchema } from '@angular/forms/signals';
import { ChangeDetectionStrategy } from '@angular/core';
import { DataFlowService } from '../../shared-services/data-flow.service';
import { AuthService } from '../services/auth.service';
import { defaultLoginModel, LoginModel, LoginSchema } from './login.model';
import { APP_TEXT } from '../../app.constant';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormField, FormRoot, Navbar, Footer],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  loginModel = signal<LoginModel>(defaultLoginModel);
  loginForm: any;

  private router = inject(Router);
  private dataFlowService = inject(DataFlowService);
  private authService = inject(AuthService);

  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  readonly authText = APP_TEXT.AUTH;

  constructor() {
    this.loginForm = form(
      this.loginModel,
      (schemaPath) => {
        validateStandardSchema(schemaPath, LoginSchema);
      },
      {
        submission: {
          action: async () => {
            this.onSubmit();
          },
        },
      },
    );
  }

  ngOnInit(): void {
    if (this.dataFlowService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm().invalid()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const { email, password } = this.loginForm().value();

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        if (error.error?.error) {
          this.submitError.set(error.error.error);
        } else {
          this.submitError.set(this.authText.LOGIN_FAILED_TRY_AGAIN);
        }
      },
    });
  }
}
