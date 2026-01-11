import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (showBanner) {
      <div class="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-slide-up">
        <div class="max-w-6xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            @if (!showPreferences) {
              <!-- Main Banner -->
              <div class="p-6 md:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white">We value your privacy</h3>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                      By clicking "Accept All", you consent to our use of cookies.
                      <a routerLink="/cookie-policy" class="text-brand-500 hover:underline">Read our Cookie Policy</a>
                    </p>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                    <button (click)="showPreferences = true"
                            class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Customize
                    </button>
                    <button (click)="rejectAll()"
                            class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                      Reject All
                    </button>
                    <button (click)="acceptAll()"
                            class="px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors btn-shine">
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            } @else {
              <!-- Preferences Panel -->
              <div class="p-6 md:p-8">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Cookie Preferences</h3>
                  <button (click)="showPreferences = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div class="space-y-4 mb-6">
                  <!-- Necessary Cookies -->
                  <div class="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div class="flex-1 mr-4">
                      <div class="flex items-center gap-2 mb-1">
                        <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Necessary Cookies</h4>
                        <span class="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">Always Active</span>
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 text-xs">Essential for the website to function properly. Cannot be disabled.</p>
                    </div>
                    <div class="relative">
                      <input type="checkbox" checked disabled class="sr-only">
                      <div class="w-11 h-6 bg-green-500 rounded-full cursor-not-allowed">
                        <div class="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Analytics Cookies -->
                  <div class="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div class="flex-1 mr-4">
                      <h4 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">Analytics Cookies</h4>
                      <p class="text-gray-500 dark:text-gray-400 text-xs">Help us understand how visitors interact with our website by collecting anonymous information.</p>
                    </div>
                    <button (click)="toggleAnalytics()" class="relative flex-shrink-0">
                      <div class="w-11 h-6 rounded-full transition-colors" [class.bg-brand-500]="preferences.analytics" [class.bg-gray-300]="!preferences.analytics" [class.dark:bg-gray-600]="!preferences.analytics">
                        <div class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-5]="preferences.analytics" [class.translate-x-0.5]="!preferences.analytics"></div>
                      </div>
                    </button>
                  </div>

                  <!-- Marketing Cookies -->
                  <div class="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div class="flex-1 mr-4">
                      <h4 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">Marketing Cookies</h4>
                      <p class="text-gray-500 dark:text-gray-400 text-xs">Used to track visitors across websites to display relevant advertisements.</p>
                    </div>
                    <button (click)="toggleMarketing()" class="relative flex-shrink-0">
                      <div class="w-11 h-6 rounded-full transition-colors" [class.bg-brand-500]="preferences.marketing" [class.bg-gray-300]="!preferences.marketing" [class.dark:bg-gray-600]="!preferences.marketing">
                        <div class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" [class.translate-x-5]="preferences.marketing" [class.translate-x-0.5]="!preferences.marketing"></div>
                      </div>
                    </button>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button (click)="rejectAll()"
                          class="flex-1 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                    Reject All
                  </button>
                  <button (click)="savePreferences()"
                          class="flex-1 px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors">
                    Save Preferences
                  </button>
                </div>

                <p class="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
                  Learn more about our cookies in our
                  <a routerLink="/privacy-policy" class="text-brand-500 hover:underline">Privacy Policy</a> and
                  <a routerLink="/cookie-policy" class="text-brand-500 hover:underline">Cookie Policy</a>.
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slide-up {
      animation: slide-up 0.4s ease-out forwards;
    }
  `]
})
export class CookieConsentComponent implements OnInit {
  showBanner = false;
  showPreferences = false;
  private isBrowser: boolean;

  preferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: 0
  };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Check for existing consent
    const savedConsent = localStorage.getItem('cookie_consent');

    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent) as CookiePreferences;
        this.preferences = parsed;

        // Apply saved preferences
        this.updateGTMConsent();

        // Check if consent is older than 6 months (180 days)
        const sixMonthsAgo = Date.now() - (180 * 24 * 60 * 60 * 1000);
        if (parsed.timestamp < sixMonthsAgo) {
          this.showBanner = true;
        }
      } catch {
        this.showBanner = true;
        this.initializeGTMConsent();
      }
    } else {
      this.showBanner = true;
      this.initializeGTMConsent();
    }
  }

  private initializeGTMConsent(): void {
    if (!this.isBrowser) return;

    // Initialize GTM with denied consent by default
    window.dataLayer = window.dataLayer || [];

    // Set default consent state (denied)
    this.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'granted',
      'personalization_storage': 'denied',
      'security_storage': 'granted'
    });
  }

  private gtag(...args: any[]): void {
    if (!this.isBrowser) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  private updateGTMConsent(): void {
    if (!this.isBrowser) return;

    window.dataLayer = window.dataLayer || [];

    // Update consent based on preferences
    this.gtag('consent', 'update', {
      'analytics_storage': this.preferences.analytics ? 'granted' : 'denied',
      'ad_storage': this.preferences.marketing ? 'granted' : 'denied',
      'ad_user_data': this.preferences.marketing ? 'granted' : 'denied',
      'ad_personalization': this.preferences.marketing ? 'granted' : 'denied'
    });

    // Push consent event to dataLayer
    window.dataLayer.push({
      'event': 'cookie_consent_update',
      'cookie_consent': {
        'necessary': true,
        'analytics': this.preferences.analytics,
        'marketing': this.preferences.marketing
      }
    });
  }

  toggleAnalytics(): void {
    this.preferences.analytics = !this.preferences.analytics;
  }

  toggleMarketing(): void {
    this.preferences.marketing = !this.preferences.marketing;
  }

  acceptAll(): void {
    this.preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    };
    this.saveAndClose();
  }

  rejectAll(): void {
    this.preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    };
    this.saveAndClose();
  }

  savePreferences(): void {
    this.preferences.timestamp = Date.now();
    this.saveAndClose();
  }

  private saveAndClose(): void {
    if (!this.isBrowser) return;

    // Save to localStorage
    localStorage.setItem('cookie_consent', JSON.stringify(this.preferences));

    // Update GTM consent
    this.updateGTMConsent();

    // Hide banner
    this.showBanner = false;
    this.showPreferences = false;
  }
}
