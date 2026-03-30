import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { DataFlowService } from '../../shared-services/data-flow.service';
import { APP_API_ENDPOINTS } from '../../app.constant';

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private dataFlowService = inject(DataFlowService);
  private router = inject(Router);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(APP_API_ENDPOINTS.AUTH.LOGIN, { email, password })
      .pipe(
        tap((response) => {
          this.dataFlowService.loginUser({ id: '', email, name: '' }, response.token);
        }),
      );
  }

  register(name: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(APP_API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });
  }

  logout(): void {
    this.dataFlowService.logoutUser();
    this.router.navigate(['/login']);
  }
}
