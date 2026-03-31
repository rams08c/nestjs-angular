import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_API_ENDPOINTS } from '../../app.constant';
import { TransactionCategory, TransactionItem, TransactionType } from '../components/transaction-form/transaction.model';

export interface TransactionPayload {
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  description?: string;
  groupId?: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionApiService {
  private http = inject(HttpClient);

  getTransactions(): Observable<TransactionItem[]> {
    return this.http.get<TransactionItem[]>(APP_API_ENDPOINTS.TRANSACTIONS.LIST);
  }

  getCategories(): Observable<TransactionCategory[]> {
    return this.http.get<TransactionCategory[]>(APP_API_ENDPOINTS.CATEGORIES.LIST);
  }

  createTransaction(payload: TransactionPayload): Observable<TransactionItem> {
    return this.http.post<TransactionItem>(APP_API_ENDPOINTS.TRANSACTIONS.CREATE, payload);
  }

  updateTransaction(id: string, payload: Partial<TransactionPayload>): Observable<TransactionItem> {
    return this.http.put<TransactionItem>(APP_API_ENDPOINTS.TRANSACTIONS.BY_ID(id), payload);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.http.delete<void>(APP_API_ENDPOINTS.TRANSACTIONS.BY_ID(id));
  }
}
