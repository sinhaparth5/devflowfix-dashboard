import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, switchMap, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    // Skip interceptor logic for auth endpoints and logout
    if (req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh') ||
        req.url.includes('/auth/logout')) {
            return next(req);
        }

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return next(req).pipe(
    catchError((error) => {
      // If 401 error and we have a refresh token, try to refresh
      if (error.status === 401 && authService.getRefreshToken() && !authService.isRefreshing()) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the request with new token
            const newToken = authService.getAccessToken();
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(clonedReq);
          }),
          catchError((refreshError) => {
            // Refresh failed, logout user (without calling API to avoid loop)
            authService.clearAuth();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
}