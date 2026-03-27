import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  readonly isLoggedIn = signal(this.getInitialLoggedInState());
  readonly currentUser = signal<User | null>(this.getInitialUser());
  readonly authToken = signal<string | null>(this.getInitialToken());

  constructor() {
    this.initializeFromSessionStorage();
  }

  private getInitialLoggedInState(): boolean {
    if (typeof window === 'undefined') return false;
    const token = sessionStorage.getItem('authToken');
    return !!token;
  }

  private getInitialToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('authToken');
  }

  private getInitialUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userJson = sessionStorage.getItem('currentUser');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  private initializeFromSessionStorage(): void {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('authToken');
      const userJson = sessionStorage.getItem('currentUser');

      if (token) {
        this.authToken.set(token);
        this.isLoggedIn.set(true);
      }

      if (userJson) {
        try {
          this.currentUser.set(JSON.parse(userJson));
        } catch {
          // Invalid user JSON, ignore
        }
      }
    }
  }

  setLoggedIn(isLoggedIn: boolean): void {
    this.isLoggedIn.set(isLoggedIn);
  }

  setUser(user: User | null): void {
    this.currentUser.set(user);
    if (user && typeof window !== 'undefined') {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    } else if (typeof window !== 'undefined') {
      sessionStorage.removeItem('currentUser');
    }
  }

  setToken(token: string | null): void {
    this.authToken.set(token);
    if (token && typeof window !== 'undefined') {
      sessionStorage.setItem('authToken', token);
    } else if (typeof window !== 'undefined') {
      sessionStorage.removeItem('authToken');
    }
  }

  clearAuth(): void {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.authToken.set(null);

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('currentUser');
    }
  }

  getToken(): string | null {
    return this.authToken();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}
