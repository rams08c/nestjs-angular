import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataFlowService } from '../services/data-flow.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private excludedRoutes = ['/api/auth/login', '/api/auth/register', '/auth/login', '/auth/register'];

  constructor(private dataFlowService: DataFlowService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if route should be excluded from token attachment
    const shouldExclude = this.excludedRoutes.some((route) => req.url.includes(route));

    if (!shouldExclude) {
      const token = this.dataFlowService.getToken();
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        // Handle successful response if needed
        if (event instanceof HttpResponse) {
          // Response handled successfully
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized: clear token and redirect to login
          this.dataFlowService.logoutUser();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
