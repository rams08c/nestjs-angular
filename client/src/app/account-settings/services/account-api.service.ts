import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_API_ENDPOINTS } from '../../app.constant';
import { AccountItem } from '../account.model';

export interface AccountPayload {
  name: string;
  type: string;
  balance: number;
}

@Injectable({ providedIn: 'root' })
export class AccountApiService {
  private http = inject(HttpClient);

  getAccounts(): Observable<AccountItem[]> {
    return this.http.get<AccountItem[]>(APP_API_ENDPOINTS.ACCOUNTS.LIST);
  }

  createAccount(payload: AccountPayload): Observable<AccountItem> {
    return this.http.post<AccountItem>(APP_API_ENDPOINTS.ACCOUNTS.CREATE, payload);
  }

  updateAccount(id: string, payload: Partial<AccountPayload>): Observable<AccountItem> {
    return this.http.put<AccountItem>(APP_API_ENDPOINTS.ACCOUNTS.BY_ID(id), payload);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(APP_API_ENDPOINTS.ACCOUNTS.BY_ID(id));
  }
}
