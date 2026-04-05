import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_API_ENDPOINTS } from '../../app.constant';
import {
  PaginatedTransactionResponse,
  TransactionCategory,
  TransactionFilterParams,
  TransactionItem,
  TransactionType,
} from '../components/transaction-form/transaction.model';

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

  getTransactions(filters?: TransactionFilterParams): Observable<PaginatedTransactionResponse> {
    let params = new HttpParams();
    if (filters) {
      if (filters.page != null) params = params.set('page', String(filters.page));
      if (filters.limit != null) params = params.set('limit', String(filters.limit));
      if (filters.search) params = params.set('search', filters.search);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
      if (filters.amountMin != null) params = params.set('amountMin', String(filters.amountMin));
      if (filters.amountMax != null) params = params.set('amountMax', String(filters.amountMax));
    }
    return this.http.get<PaginatedTransactionResponse>(APP_API_ENDPOINTS.TRANSACTIONS.LIST, { params });
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
