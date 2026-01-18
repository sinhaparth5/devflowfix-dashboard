import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="text-center">
        <!-- Loading Spinner -->
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-brand-500 mb-6"></div>

        <!-- Loading Text -->
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Completing sign in...
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Please wait while we verify your credentials.
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CallbackComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Handle the OAuth callback
    this.authService.handleCallback();
  }
}
