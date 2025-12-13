import { Injectable } from '@angular/core';

export interface SecurityConfig {
  csp: {
    enabled: boolean;
    reportUri?: string;
  };
  sanitization: {
    strictMode: boolean;
    logViolations: boolean;
  };
  validation: {
    maxInputLength: number;
    allowedFileTypes: string[];
    maxFileSize: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SecurityConfigService {
  private config: SecurityConfig = {
    csp: {
      enabled: true,
      reportUri: undefined // Can add CSP violation reporting endpoint
    },
    sanitization: {
      strictMode: true,
      logViolations: true
    },
    validation: {
      maxInputLength: 10000,
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: 5 * 1024 * 1024 // 5MB
    }
  };

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  logSecurityViolation(type: string, details: any): void {
    if (this.config.sanitization.logViolations) {
      console.warn(`[SECURITY] ${type}:`, details);

      // In production, send to monitoring service
      // this.monitoringService.trackSecurityEvent(type, details);
    }
  }
}
