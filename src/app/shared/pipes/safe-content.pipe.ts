import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { SanitizationService } from '../services/sanitization.service';

/**
 * Safe Content Pipe - Replaces the old SafeHtmlPipe
 *
 * Usage:
 * - For static SVG icons (trusted): {{ svg | safeContent:'bypass' }}
 * - For user content (sanitize): {{ html | safeContent:'html' }}
 * - For URLs: {{ url | safeContent:'url' }}
 */
@Pipe({
  name: 'safeContent',
  standalone: true
})
export class SafeContentPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer,
    private sanitizationService: SanitizationService
  ) {}

  transform(value: string, type: 'html' | 'url' | 'bypass' = 'html'): SafeHtml | SafeUrl | string {
    if (!value) return '';

    switch (type) {
      case 'bypass':
        // ONLY for trusted static content (SVG icons, etc.)
        return this.sanitizationService.bypassHtmlSecurity(value);

      case 'html':
        // For user-generated content - sanitizes dangerous elements
        return this.sanitizationService.sanitizeHtml(value);

      case 'url':
        // For URL binding
        return this.sanitizationService.sanitizeSafeUrl(value);

      default:
        return value;
    }
  }
}
