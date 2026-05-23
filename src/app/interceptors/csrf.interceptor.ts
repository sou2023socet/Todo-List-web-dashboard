import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CsrfService } from '../services/csrf.service';

@Injectable({
  providedIn: 'root'
})
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private csrf: CsrfService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only for state-changing requests
    const method = (req.method || '').toUpperCase();
    if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
      const token = this.csrf.getCsrfToken();
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            'X-XSRF-TOKEN': token
          }
        });
        return next.handle(cloned);
      }
    }

    return next.handle(req);
  }
}

