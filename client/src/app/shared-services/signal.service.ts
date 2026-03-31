import { Injectable, signal } from '@angular/core';
import { AccountItem } from '../account-settings/account.model';
import { SettingsFormModel } from '../account-settings/settings.model';

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
  readonly accounts = signal<AccountItem[]>([]);
  readonly settings = signal<SettingsFormModel | null>(null);

  constructor() {
    this.initializeFromSessionStorage();
    this.registerStorageSyncListeners();
  }

  private getInitialLoggedInState(): boolean {
    if (typeof window === 'undefined') return false;
    const token = sessionStorage.getItem('authToken');
    return !!token && !this.isTokenExpired(token);
  }

  private getInitialToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = sessionStorage.getItem('authToken');
    if (!token || this.isTokenExpired(token)) {
      return null;
    }
    return token;
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

      if (token && !this.isTokenExpired(token)) {
        this.authToken.set(token);
        this.isLoggedIn.set(true);
      } else if (token) {
        this.clearAuth();
        return;
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

  private registerStorageSyncListeners(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    window.addEventListener('focus', () => {
      this.syncAuthStateFromStorage();
    });

    window.addEventListener('storage', () => {
      this.syncAuthStateFromStorage();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncAuthStateFromStorage();
      }
    });
  }

  private syncAuthStateFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const storedToken = sessionStorage.getItem('authToken');
    const storedUser = sessionStorage.getItem('currentUser');

    if (!storedToken || this.isTokenExpired(storedToken)) {
      if (this.authToken() || this.isLoggedIn() || this.currentUser()) {
        this.clearAuth();
      }
      return;
    }

    if (this.authToken() !== storedToken) {
      this.authToken.set(storedToken);
    }

    if (!this.isLoggedIn()) {
      this.isLoggedIn.set(true);
    }

    if (!storedUser) {
      this.currentUser.set(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      const currentUser = this.currentUser();

      if (JSON.stringify(currentUser) !== JSON.stringify(parsedUser)) {
        this.currentUser.set(parsedUser);
      }
    } catch {
      this.currentUser.set(null);
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
    this.syncAuthStateFromStorage();

    const token = this.authToken();
    if (!token) {
      return null;
    }

    if (this.isTokenExpired(token)) {
      this.clearAuth();
      return null;
    }

    return token;
  }

  isAuthenticated(): boolean {
    this.syncAuthStateFromStorage();
    return !!this.getToken() && this.isLoggedIn();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return true;
      }

      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const decoded = JSON.parse(atob(normalized)) as { exp?: number };

      if (!decoded.exp) {
        return true;
      }

      return decoded.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
