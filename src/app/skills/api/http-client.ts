import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../app/core/http/api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  private withCreds() {
    return { withCredentials: true };
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...this.withCreds()
    });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${API_CONFIG.BASE_URL}${endpoint}`, body, {
      ...this.withCreds()
    });
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${API_CONFIG.BASE_URL}${endpoint}`, body, {
      ...this.withCreds()
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...this.withCreds()
    });
  }
}
