import { Injectable } from '@angular/core';
import { SignalService, User } from './signal.service';

@Injectable({
  providedIn: 'root',
})
export class DataFlowService {
  constructor(private signalService: SignalService) {}

  // Expose signals publicly
  get isLoggedIn() {
    return this.signalService.isLoggedIn;
  }

  get currentUser() {
    return this.signalService.currentUser;
  }

  get authToken() {
    return this.signalService.authToken;
  }

  // Convenience methods
  loginUser(user: User, token: string): void {
    this.signalService.setUser(user);
    this.signalService.setToken(token);
    this.signalService.setLoggedIn(true);
  }

  logoutUser(): void {
    this.signalService.clearAuth();
  }

  getToken(): string | null {
    return this.signalService.getToken();
  }

  isAuthenticated(): boolean {
    return this.signalService.isAuthenticated();
  }
}
