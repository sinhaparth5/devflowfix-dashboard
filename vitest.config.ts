// vitest.config.ts  (or vite.config.ts)
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./src/test-setup.ts'],

    browser: {
      enabled: true,

      provider: playwright({
        // Examples of valid shared options:
        // launchOptions: { slowMo: 50 },
        // actionTimeout: 10000,
        // trace: 'on', // useful for debugging failures
      }),

      instances: [
        {
          browser: 'chromium',    
          headless: true,         
        },
      ],
    },

    include: ['**/*.spec.ts', '**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});