import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private key = 'todo_app_jwt_token';

  saveToken(token: string): void {
    sessionStorage.setItem(this.key, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.key);
  }

  clear(): void {
    sessionStorage.removeItem(this.key);
  }
}
