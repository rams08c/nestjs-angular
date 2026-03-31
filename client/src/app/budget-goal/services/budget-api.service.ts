import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_API_ENDPOINTS } from '../../app.constant';
import { BudgetItem, BudgetPeriod } from '../budget-goal.model';

export interface BudgetPayload {
  categoryId: string;
  limitAmount: number;
  period: BudgetPeriod;
}

@Injectable({ providedIn: 'root' })
export class BudgetApiService {
  private http = inject(HttpClient);

  getBudgets(): Observable<BudgetItem[]> {
    return this.http.get<BudgetItem[]>(APP_API_ENDPOINTS.BUDGETS.LIST);
  }

  createBudget(payload: BudgetPayload): Observable<BudgetItem> {
    return this.http.post<BudgetItem>(APP_API_ENDPOINTS.BUDGETS.CREATE, payload);
  }

  updateBudget(id: string, payload: Partial<BudgetPayload>): Observable<BudgetItem> {
    return this.http.put<BudgetItem>(APP_API_ENDPOINTS.BUDGETS.BY_ID(id), payload);
  }

  deleteBudget(id: string): Observable<void> {
    return this.http.delete<void>(APP_API_ENDPOINTS.BUDGETS.BY_ID(id));
  }
}