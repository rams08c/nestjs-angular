import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_API_ENDPOINTS } from '../../app.constant';
import { GoalItem } from '../budget-goal.model';

export interface GoalPayload {
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string;
}

@Injectable({ providedIn: 'root' })
export class GoalApiService {
  private http = inject(HttpClient);

  getGoals(): Observable<GoalItem[]> {
    return this.http.get<GoalItem[]>(APP_API_ENDPOINTS.GOALS.LIST);
  }

  createGoal(payload: GoalPayload): Observable<GoalItem> {
    return this.http.post<GoalItem>(APP_API_ENDPOINTS.GOALS.CREATE, payload);
  }

  updateGoal(id: string, payload: Partial<GoalPayload>): Observable<GoalItem> {
    return this.http.put<GoalItem>(APP_API_ENDPOINTS.GOALS.BY_ID(id), payload);
  }

  deleteGoal(id: string): Observable<void> {
    return this.http.delete<void>(APP_API_ENDPOINTS.GOALS.BY_ID(id));
  }
}