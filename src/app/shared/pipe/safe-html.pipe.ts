import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SanitizationService } from '../services/sanitization.service';

/**
 * @deprecated Use SafeContentPipe instead for better security
 * This pipe is kept for backward compatibility
 */
@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer,
    private sanitizationService: SanitizationService
  ) {}

  transform(value: string, trusted: boolean = false): SafeHtml {
    if (!value) return '';

    // If explicitly marked as trusted (for static SVG icons)
    if (trusted) {
      return this.sanitizationService.bypassHtmlSecurity(value);
    }

    // Otherwise, sanitize it
    return this.sanitizationService.sanitizeHtml(value);
  }
}