import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // Zitadel instance URL
  issuer: 'https://devflowfix-app-chto42.us1.zitadel.cloud',

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
  showDebugInformation: true,

  // Use silent refresh for token renewal
  useSilentRefresh: true,
  silentRefreshRedirectUri: typeof window !== 'undefined' ? `${window.location.origin}/silent-refresh.html` : '',

  // Session checks - disabled as Zitadel doesn't support check_session_iframe
  sessionChecksEnabled: false,

  // Relaxed validation for Zitadel compatibility
  strictDiscoveryDocumentValidation: false,

  // OIDC standard
  oidc: true,

  // Required for public clients (SPAs) - empty string means no secret
  dummyClientSecret: '',

  // Don't require HTTPS in development
  requireHttps: false,
};

// Environment-specific configurations
export const environment = {
  production: typeof window !== 'undefined' && window.location.hostname !== 'localhost',
  apiUrl: 'https://api.devflowfix.com/api/v1',
};
