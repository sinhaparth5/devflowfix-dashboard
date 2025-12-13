import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

export interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripUnknown?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SanitizationService {

  constructor(private domSanitizer: DomSanitizer) {}

  /**
   * Sanitize plain text input - removes HTML tags and encodes special characters
   * Use this for: user names, email inputs, search queries, form text fields
   */
  sanitizeText(input: string): string {
    if (!input) return '';

    // Remove any HTML tags
    const stripped = input.replace(/<[^>]*>/g, '');

    // Encode special characters
    return this.encodeHtml(stripped);
  }

  /**
   * Sanitize email input - validates format and removes dangerous characters
   */
  sanitizeEmail(email: string): string {
    if (!email) return '';

    // Remove any non-email characters
    const cleaned = email
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^\w\s@.\-+]/gi, '') // Keep only valid email chars
      .trim()
      .toLowerCase();

    return cleaned;
  }

  /**
   * Sanitize URL input - validates URL and prevents javascript: and data: URIs
   */
  sanitizeUrl(url: string): string {
    if (!url) return '';

    const trimmed = url.trim().toLowerCase();

    // Block dangerous protocols
    if (
      trimmed.startsWith('javascript:') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('vbscript:') ||
      trimmed.startsWith('file:')
    ) {
      return '';
    }

    // Allow only http, https, mailto
    if (
      !trimmed.startsWith('http://') &&
      !trimmed.startsWith('https://') &&
      !trimmed.startsWith('mailto:') &&
      !trimmed.startsWith('/')
    ) {
      return '';
    }

    return url.trim();
  }

  /**
   * Sanitize HTML with Angular's DomSanitizer
   * ONLY use this for trusted content that needs HTML rendering
   */
  sanitizeHtml(html: string, config?: SanitizationConfig): SafeHtml {
    if (!html) return '';

    // First pass: strip potentially dangerous tags
    let cleaned = this.stripDangerousTags(html);

    // If config provided, apply whitelist filtering
    if (config?.allowedTags) {
      cleaned = this.filterAllowedTags(cleaned, config);
    }

    // Let Angular sanitize it (this is safe)
    // This will remove any remaining dangerous content
    return this.domSanitizer.sanitize(1, cleaned) || ''; // 1 = SecurityContext.HTML
  }

  /**
   * For SVG icons and trusted static content ONLY
   * DO NOT use this for user-generated content
   */
  bypassHtmlSecurity(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * Sanitize for safe URL binding (img src, a href)
   */
  sanitizeSafeUrl(url: string): SafeUrl {
    const cleaned = this.sanitizeUrl(url);
    if (!cleaned) return '';

    return this.domSanitizer.sanitize(4, cleaned) || ''; // 4 = SecurityContext.URL
  }

  /**
   * For iframes and resource URLs
   */
  sanitizeResourceUrl(url: string): SafeResourceUrl {
    const cleaned = this.sanitizeUrl(url);
    if (!cleaned) return '';

    return this.domSanitizer.bypassSecurityTrustResourceUrl(cleaned);
  }

  /**
   * Encode HTML special characters
   */
  private encodeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Strip dangerous HTML tags
   */
  private stripDangerousTags(html: string): string {
    const dangerousTags = [
      'script', 'iframe', 'object', 'embed', 'link',
      'style', 'base', 'meta', 'applet', 'form'
    ];

    let cleaned = html;
    dangerousTags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi');
      cleaned = cleaned.replace(regex, '');
      // Also remove self-closing tags
      const selfClosing = new RegExp(`<${tag}[^>]*/>`, 'gi');
      cleaned = cleaned.replace(selfClosing, '');
    });

    return cleaned;
  }

  /**
   * Filter to only allowed tags
   */
  private filterAllowedTags(html: string, config: SanitizationConfig): string {
    if (!config.allowedTags || config.allowedTags.length === 0) {
      return this.encodeHtml(html); // No tags allowed, return encoded text
    }

    // This is a simple implementation
    // For production, consider using a library like DOMPurify
    const div = document.createElement('div');
    div.innerHTML = html;

    this.sanitizeNode(div, config.allowedTags, config.allowedAttributes || {});

    return div.innerHTML;
  }

  /**
   * Recursively sanitize DOM nodes
   */
  private sanitizeNode(
    node: Node,
    allowedTags: string[],
    allowedAttributes: Record<string, string[]>
  ): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Remove if tag not allowed
      if (!allowedTags.includes(tagName)) {
        element.remove();
        return;
      }

      // Remove disallowed attributes
      const attrs = Array.from(element.attributes);
      const allowedAttrs = allowedAttributes[tagName] || [];

      attrs.forEach(attr => {
        if (!allowedAttrs.includes(attr.name)) {
          element.removeAttribute(attr.name);
        }
      });
    }

    // Recursively sanitize child nodes
    const children = Array.from(node.childNodes);
    children.forEach(child => this.sanitizeNode(child, allowedTags, allowedAttributes));
  }

  /**
   * Sanitize JSON input to prevent injection
   */
  sanitizeJson(input: any): any {
    if (typeof input === 'string') {
      return this.sanitizeText(input);
    }

    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeJson(item));
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeJson(input[key]);
        }
      }
      return sanitized;
    }

    return input;
  }

  /**
   * Validate and sanitize file uploads
   */
  validateFile(file: File, options: {
    allowedTypes?: string[];
    maxSize?: number; // in bytes
  }): { valid: boolean; error?: string } {
    // Check file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const isAllowed = options.allowedTypes.some(type =>
        file.type.startsWith(type) || file.name.endsWith(type)
      );

      if (!isAllowed) {
        return {
          valid: false,
          error: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
        };
      }
    }

    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`
      };
    }

    return { valid: true };
  }
}
