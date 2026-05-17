import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthRequest } from '../models/auth-request.interface';
import { AuthResponse } from '../models/auth-response.interface';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private tokenStorage: TokenStorageService
  ) {
    const storedUser = this.tokenStorage.getUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  register(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', authRequest).pipe(
      map(response => response.data!)
    );
  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', authRequest).pipe(
      map(response => {
        const user = response.data!;
        if (user.token) {
          this.tokenStorage.saveToken(user.token);
          this.tokenStorage.saveUser(user);
        }
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokenStorage.getToken();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }
}