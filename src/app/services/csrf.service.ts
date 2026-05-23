import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  /**
   * Reads XSRF token from cookie named `XSRF-TOKEN`
   * The backend is expected to set it (Spring Security / CSRF token repository).
   */
  getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
}

