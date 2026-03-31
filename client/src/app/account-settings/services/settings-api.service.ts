import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_API_ENDPOINTS } from '../../app.constant';
import { SettingsFormModel } from '../settings.model';

export interface SettingsResponse {
  firstName: string | null;
  lastName: string | null;
  profilePic: string | null;
  location: string | null;
  address: string | null;
  country: string | null;
}

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  private http = inject(HttpClient);

  getSettings(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(APP_API_ENDPOINTS.SETTINGS.GET);
  }

  updateSettings(payload: Partial<SettingsFormModel>): Observable<SettingsResponse> {
    return this.http.put<SettingsResponse>(APP_API_ENDPOINTS.SETTINGS.UPDATE, payload);
  }
}
