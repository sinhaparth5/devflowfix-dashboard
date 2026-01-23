import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, throwError } from 'rxjs';

/**
 * Get access token from cookie (for custom login flow)
 */
function getAccessTokenFromCookie(): string | null {
  const nameEQ = 'access_token=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

/**
 * HTTP Interceptor that attaches the access token to API requests
 * and handles authentication errors.
 *
 * Checks both OAuth token (from OAuthService) and cookie-based token
 * (from custom login flow) to support both authentication methods.
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
    // Try OAuth token first, then fall back to cookie-based token
    const token = oauthService.getAccessToken() || getAccessTokenFromCookie();

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
