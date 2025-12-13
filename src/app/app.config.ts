import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

import { routes } from './app.routes';
import { authInterceptor } from './shared/components/auth/auth.interceptor';
import { sanitizationInterceptor } from './shared/interceptors/sanitization.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([sanitizationInterceptor, authInterceptor])
    ),
    provideLottieOptions({
      player: () => player,
    })
  ]
};
