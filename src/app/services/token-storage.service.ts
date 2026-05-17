import { Injectable } from '@angular/core';

const STORAGE_KEY_TOKEN = 'todo_app_jwt_token';
const STORAGE_KEY_USER = 'todo_app_user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  saveToken(token: string): void {
    sessionStorage.setItem(STORAGE_KEY_TOKEN, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEY_TOKEN);
  }

  saveUser(user: any): void {
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  }

  getUser(): any {
    const user = sessionStorage.getItem(STORAGE_KEY_USER);
    return user ? JSON.parse(user) : null;
  }

  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);
  }
}
