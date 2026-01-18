import { HttpInterceptorFn, HttpRequest, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { SanitizationService } from '../services/sanitization.service';

export const sanitizationInterceptor: HttpInterceptorFn = (req, next) => {
  const sanitizationService = inject(SanitizationService);

  // Skip sanitization for certain endpoints (like file uploads and OAuth)
  const skipSanitization = [
    '/me/avatar', // File upload endpoint
    'zitadel.cloud', // OAuth provider - don't modify OAuth requests
  ];

  const shouldSkip = skipSanitization.some(path => req.url.includes(path));

  // Skip if URL matches skip list, no body, GET request, or body is HttpParams (form data)
  if (shouldSkip || !req.body || req.method === 'GET' || req.body instanceof HttpParams) {
    return next(req);
  }

  // Clone and sanitize the request body
  let sanitizedBody = req.body;

  // Only sanitize JSON bodies (plain objects, not FormData, HttpParams, etc.)
  if (req.headers.get('Content-Type')?.includes('application/json') ||
      (typeof req.body === 'object' && req.body.constructor === Object)) {

    // Deep clone and sanitize
    sanitizedBody = sanitizationService.sanitizeJson(req.body);
  }

  // Clone request with sanitized body
  const sanitizedReq = req.clone({
    body: sanitizedBody
  });

  return next(sanitizedReq);
};
