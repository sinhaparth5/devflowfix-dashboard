import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { WasmService } from './wasm.service';

export interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripUnknown?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SanitizationService {

  constructor(
    private domSanitizer: DomSanitizer,
    private wasmService: WasmService
  ) {}

  /**
   * Sanitize plain text input - removes HTML tags and encodes special characters
   * Use this for: user names, email inputs, search queries, form text fields
   * Delegated to WASM for performance (pre-compiled regex + no DOM element creation)
   */
  sanitizeText(input: string): string {
    if (!input) return '';
    return this.wasmService.module.sanitize_text(input);
  }

  /**
   * Sanitize email input - validates format and removes dangerous characters
   * Delegated to WASM for faster regex processing
   */
  sanitizeEmail(email: string): string {
    if (!email) return '';
    return this.wasmService.module.sanitize_email(email);
  }

  /**
   * Sanitize URL input - validates URL and prevents javascript: and data: URIs
   * Delegated to WASM for faster string checks
   */
  sanitizeUrl(url: string): string {
    if (!url) return '';
    return this.wasmService.module.sanitize_url(url);
  }

  /**
   * Sanitize HTML with Angular's DomSanitizer
   * ONLY use this for trusted content that needs HTML rendering
   */
  sanitizeHtml(html: string, config?: SanitizationConfig): SafeHtml {
    if (!html) return '';

    // First pass: strip potentially dangerous tags (via WASM)
    let cleaned = this.wasmService.module.strip_dangerous_tags(html);

    // If config provided, apply whitelist filtering (requires DOM)
    if (config?.allowedTags) {
      cleaned = this.filterAllowedTags(cleaned, config);
    }

    // Let Angular sanitize it (this is safe)
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
   * Filter to only allowed tags (requires DOM for parsing/traversal)
   */
  private filterAllowedTags(html: string, config: SanitizationConfig): string {
    if (!config.allowedTags || config.allowedTags.length === 0) {
      return this.wasmService.module.encode_html(html);
    }

    const div = document.createElement('div');
    div.innerHTML = html;

    this.sanitizeNode(div, config.allowedTags, config.allowedAttributes || {});

    return div.innerHTML;
  }

  /**
   * Recursively sanitize DOM nodes (must stay in TS — manipulates live DOM)
   */
  private sanitizeNode(
    node: Node,
    allowedTags: string[],
    allowedAttributes: Record<string, string[]>
  ): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      if (!allowedTags.includes(tagName)) {
        element.remove();
        return;
      }

      const attrs = Array.from(element.attributes);
      const allowedAttrs = allowedAttributes[tagName] || [];

      attrs.forEach(attr => {
        if (!allowedAttrs.includes(attr.name)) {
          element.removeAttribute(attr.name);
        }
      });
    }

    const children = Array.from(node.childNodes);
    children.forEach(child => this.sanitizeNode(child, allowedTags, allowedAttributes));
  }

  /**
   * Sanitize JSON input to prevent injection
   * Delegated to WASM — entire recursive traversal happens in Rust
   * with zero JS↔WASM boundary crossings per string
   */
  sanitizeJson(input: any): any {
    if (input === null || input === undefined) return input;
    if (typeof input === 'string') {
      return this.wasmService.module.sanitize_text(input);
    }
    if (typeof input !== 'object') return input;

    return this.wasmService.module.sanitize_json(input);
  }

  /**
   * Validate and sanitize file uploads
   */
  validateFile(file: File, options: {
    allowedTypes?: string[];
    maxSize?: number; // in bytes
  }): { valid: boolean; error?: string } {
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
