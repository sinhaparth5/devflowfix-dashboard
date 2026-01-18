import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Interceptor that attaches the access token to API requests
 * and handles authentication errors.
 *
 * Note: We inject OAuthService directly instead of AuthService to avoid
 * circular dependency issues during OAuth initialization.
 */
export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const oauthService = inject(OAuthService);
  const router = inject(Router);

  // Skip auth header for Zitadel/OAuth URLs
  if (request.url.includes('zitadel.cloud')) {
    return next(request);
  }

  // Only add auth header for API requests
  const apiUrl = 'https://api.devflowfix.com';

  if (request.url.startsWith(apiUrl)) {
    const token = oauthService.getAccessToken();

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
        // Token is invalid or expired - redirect to login
        // Store the current URL to return after login
        sessionStorage.setItem('returnUrl', router.url);
        router.navigate(['/signin']);
      }

      return throwError(() => error);
    })
  );
};
