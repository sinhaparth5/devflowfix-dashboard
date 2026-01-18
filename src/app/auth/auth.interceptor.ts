import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * HTTP Interceptor that attaches the access token to API requests
 * and handles authentication errors
 */
export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Only add auth header for API requests
  const apiUrl = 'https://api.devflowfix.com';

  if (request.url.startsWith(apiUrl)) {
    const token = authService.getAccessToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token is invalid or expired
        // Try to refresh, or redirect to login
        if (authService.hasValidToken()) {
          // Token might be expired, try to refresh
          authService.refreshToken().catch(() => {
            authService.logout();
          });
        } else {
          // No valid token, redirect to login
          authService.login(router.url);
        }
      }

      return throwError(() => error);
    })
  );
};
