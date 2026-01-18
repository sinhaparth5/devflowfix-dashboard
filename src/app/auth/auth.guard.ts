import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard for protected routes - requires authentication
 * Redirects to Zitadel login if not authenticated
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth to initialize
  if (authService.isLoading()) {
    // Return a promise that resolves when loading is complete
    return new Promise<boolean>((resolve) => {
      const checkAuth = () => {
        if (!authService.isLoading()) {
          if (authService.isAuthenticated()) {
            resolve(true);
          } else {
            // Not authenticated - redirect to login
            authService.login(state.url);
            resolve(false);
          }
        } else {
          setTimeout(checkAuth, 50);
        }
      };
      checkAuth();
    });
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  // Not authenticated - redirect to Zitadel login
  authService.login(state.url);
  return false;
};

/**
 * Guard for public routes - redirects to dashboard if already authenticated
 * Use for login page, signup page, etc.
 */
export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth to initialize
  if (authService.isLoading()) {
    return new Promise<boolean>((resolve) => {
      const checkAuth = () => {
        if (!authService.isLoading()) {
          if (authService.isAuthenticated()) {
            router.navigate(['/dashboard']);
            resolve(false);
          } else {
            resolve(true);
          }
        } else {
          setTimeout(checkAuth, 50);
        }
      };
      checkAuth();
    });
  }

  if (authService.isAuthenticated()) {
    // Already authenticated - redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

/**
 * Guard alias for backward compatibility
 */
export const guestGuard = noAuthGuard;
