import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { filter } from 'rxjs/operators';

export interface ZitadelUser {
  sub: string;           // Zitadel user ID
  email: string;
  email_verified: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  picture?: string;
  locale?: string;
  updated_at?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private oauthService = inject(OAuthService);

  // Reactive signals for auth state
  private _isAuthenticated = signal(false);
  private _user = signal<ZitadelUser | null>(null);
  private _isLoading = signal(true);

  // Public computed values
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly user = computed(() => this._user());
  readonly isLoading = computed(() => this._isLoading());

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    try {
      // Configure OAuth service
      this.oauthService.configure(authConfig);

      // Set up event listeners
      this.setupEventListeners();

      // Load discovery document and try to login
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();

      // Check if user is authenticated
      if (this.oauthService.hasValidAccessToken()) {
        this._isAuthenticated.set(true);
        this.loadUserProfile();
      }

      // Setup automatic token refresh
      this.oauthService.setupAutomaticSilentRefresh();
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      this._isLoading.set(false);
    }
  }

  private setupEventListeners(): void {
    this.oauthService.events
      .pipe(filter((e: OAuthEvent) => e.type === 'token_received'))
      .subscribe(() => {
        this._isAuthenticated.set(true);
        this.loadUserProfile();
      });

    this.oauthService.events
      .pipe(filter((e: OAuthEvent) => e.type === 'token_expires'))
      .subscribe(() => {
        // Token is about to expire, try to refresh
        this.oauthService.silentRefresh().catch(() => {
          this.logout();
        });
      });

    this.oauthService.events
      .pipe(filter((e: OAuthEvent) => e.type === 'session_terminated'))
      .subscribe(() => {
        this._isAuthenticated.set(false);
        this._user.set(null);
      });
  }

  private loadUserProfile(): void {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this._user.set({
        sub: claims['sub'] as string,
        email: claims['email'] as string,
        email_verified: claims['email_verified'] as boolean,
        name: claims['name'] as string,
        given_name: claims['given_name'] as string,
        family_name: claims['family_name'] as string,
        preferred_username: claims['preferred_username'] as string,
        picture: claims['picture'] as string,
        locale: claims['locale'] as string,
        updated_at: claims['updated_at'] as number,
      });
    }
  }

  /**
   * Initiate login flow - redirects to Zitadel
   */
  login(returnUrl?: string): void {
    // Store the return URL to redirect after login
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    } else {
      sessionStorage.setItem('returnUrl', this.router.url);
    }

    // Redirect to Zitadel login
    this.oauthService.initCodeFlow();
  }

  /**
   * Initiate registration flow - redirects to Zitadel registration page
   */
  register(returnUrl?: string): void {
    // Store the return URL to redirect after registration
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    } else {
      sessionStorage.setItem('returnUrl', this.router.url);
    }

    // Redirect to Zitadel with prompt=create to show registration
    this.oauthService.initCodeFlow('', { prompt: 'create' });
  }

  /**
   * Handle the callback from Zitadel after login
   */
  async handleCallback(): Promise<void> {
    this._isLoading.set(true);

    try {
      // The library handles the code exchange automatically
      await this.oauthService.loadDiscoveryDocumentAndTryLogin();

      if (this.oauthService.hasValidAccessToken()) {
        this._isAuthenticated.set(true);
        this.loadUserProfile();

        // Redirect to stored URL or dashboard
        const returnUrl = sessionStorage.getItem('returnUrl') || '/dashboard';
        sessionStorage.removeItem('returnUrl');
        this.router.navigateByUrl(returnUrl);
      } else {
        // Login failed, redirect to home
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Callback handling error:', error);
      this.router.navigate(['/']);
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Logout user - clears tokens and redirects to Zitadel logout
   */
  logout(): void {
    this._isAuthenticated.set(false);
    this._user.set(null);
    this.oauthService.logOut();
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  /**
   * Get the current ID token
   */
  getIdToken(): string | null {
    return this.oauthService.getIdToken();
  }

  /**
   * Check if user has a valid access token
   */
  hasValidToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  /**
   * Manually refresh the access token
   */
  async refreshToken(): Promise<void> {
    try {
      await this.oauthService.silentRefresh();
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
    }
  }

  /**
   * Get user's display name
   */
  getDisplayName(): string {
    const user = this._user();
    if (!user) return '';
    return user.name || user.preferred_username || user.email || '';
  }

  /**
   * Get user's avatar URL
   */
  getAvatarUrl(): string | null {
    return this._user()?.picture || null;
  }

  /**
   * Get user's email
   */
  getEmail(): string | null {
    return this._user()?.email || null;
  }

  /**
   * Get Zitadel user ID
   */
  getUserId(): string | null {
    return this._user()?.sub || null;
  }
}
