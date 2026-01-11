import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './shared/components/auth/auth.interceptor';
import { sanitizationInterceptor } from './shared/interceptors/sanitization.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withViewTransitions()
    ),
    provideHttpClient(
      withInterceptors([sanitizationInterceptor, authInterceptor])
    ),
  ]
};
