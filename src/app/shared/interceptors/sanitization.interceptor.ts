import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { SanitizationService } from '../services/sanitization.service';

export const sanitizationInterceptor: HttpInterceptorFn = (req, next) => {
  const sanitizationService = inject(SanitizationService);

  // Skip sanitization for certain endpoints (like file uploads)
  const skipSanitization = [
    '/me/avatar', // File upload endpoint
  ];

  const shouldSkip = skipSanitization.some(path => req.url.includes(path));

  if (shouldSkip || !req.body || req.method === 'GET') {
    return next(req);
  }

  // Clone and sanitize the request body
  let sanitizedBody = req.body;

  // Only sanitize JSON bodies
  if (req.headers.get('Content-Type')?.includes('application/json') ||
      typeof req.body === 'object') {

    // Deep clone and sanitize
    sanitizedBody = sanitizationService.sanitizeJson(req.body);
  }

  // Clone request with sanitized body
  const sanitizedReq = req.clone({
    body: sanitizedBody
  });

  return next(sanitizedReq);
};
