import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // Zitadel instance URL
  issuer: 'https://devflowfix.us1.zitadel.cloud',

  // Client ID from Zitadel Console
  clientId: '356071917330913824',

  // Where Zitadel redirects after login
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',

  // Where to go after logout
  postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : '',

  // Use PKCE (required for SPAs)
  responseType: 'code',

  // Scopes to request
  scope: 'openid profile email offline_access',

  // Show debug info in console (disable in production)
  showDebugInformation: false,

  // Use silent refresh for token renewal
  useSilentRefresh: true,
  silentRefreshRedirectUri: typeof window !== 'undefined' ? `${window.location.origin}/silent-refresh.html` : '',

  // Session checks
  sessionChecksEnabled: true,

  // Strict discovery document validation
  strictDiscoveryDocumentValidation: true,

  // Don't require HTTPS in development
  requireHttps: true,
};

// Environment-specific configurations
export const environment = {
  production: typeof window !== 'undefined' && window.location.hostname !== 'localhost',
  apiUrl: 'https://api.devflowfix.com/api/v1',
};
