import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guest Guard - Prevents authenticated users from accessing auth pages
 * Redirects logged-in users to dashboard
 */
export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // If user is logged in, redirect to dashboard
    if (authService.isLoggedIn()) {
        router.navigate(['/dashboard']);
        return false;
    }

    // If not logged in, allow access to auth pages
    return true;
}
