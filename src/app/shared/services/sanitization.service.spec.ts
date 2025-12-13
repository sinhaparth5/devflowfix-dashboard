import { TestBed } from '@angular/core/testing';
import { SanitizationService } from './sanitization.service';

describe('SanitizationService', () => {
  let service: SanitizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanitizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      const input = 'Hello <script>alert("XSS")</script> World';
      const result = service.sanitizeText(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Hello');
    });

    it('should encode special characters', () => {
      const input = '<div>Test & "quotes"</div>';
      const result = service.sanitizeText(input);
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    it('should return empty string for null input', () => {
      const result = service.sanitizeText('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('should clean email addresses', () => {
      const input = 'user<script>@example.com';
      const result = service.sanitizeEmail(input);
      expect(result).not.toContain('<script>');
      expect(result).toBe('user@example.com');
    });

    it('should convert to lowercase', () => {
      const input = 'USER@EXAMPLE.COM';
      const result = service.sanitizeEmail(input);
      expect(result).toBe('user@example.com');
    });

    it('should remove invalid characters', () => {
      const input = 'user!#$%@example.com';
      const result = service.sanitizeEmail(input);
      expect(result).toBe('user@example.com');
    });

    it('should return empty string for null input', () => {
      const result = service.sanitizeEmail('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeUrl', () => {
    it('should block javascript: URLs', () => {
      const input = 'javascript:alert(1)';
      const result = service.sanitizeUrl(input);
      expect(result).toBe('');
    });

    it('should allow valid HTTP URLs', () => {
      const input = 'https://example.com';
      const result = service.sanitizeUrl(input);
      expect(result).toBe('https://example.com');
    });

    it('should block data: URLs', () => {
      const input = 'data:text/html,<script>alert(1)</script>';
      const result = service.sanitizeUrl(input);
      expect(result).toBe('');
    });

    it('should block vbscript: URLs', () => {
      const input = 'vbscript:alert(1)';
      const result = service.sanitizeUrl(input);
      expect(result).toBe('');
    });

    it('should block file: URLs', () => {
      const input = 'file:///etc/passwd';
      const result = service.sanitizeUrl(input);
      expect(result).toBe('');
    });

    it('should allow mailto: URLs', () => {
      const input = 'mailto:test@example.com';
      const result = service.sanitizeUrl(input);
      expect(result).toBe('mailto:test@example.com');
    });

    it('should allow relative URLs', () => {
      const input = '/path/to/page';
      const result = service.sanitizeUrl(input);
      expect(result).toBe('/path/to/page');
    });

    it('should return empty string for null input', () => {
      const result = service.sanitizeUrl('');
      expect(result).toBe('');
    });
  });

  describe('validateFile', () => {
    it('should reject files exceeding size limit', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg'
      });

      const result = service.validateFile(largeFile, { maxSize: 5 * 1024 * 1024 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    it('should accept valid files', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = service.validateFile(validFile, {
        allowedTypes: ['image/'],
        maxSize: 5 * 1024 * 1024
      });
      expect(result.valid).toBe(true);
    });

    it('should reject invalid file types', () => {
      const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      const result = service.validateFile(invalidFile, {
        allowedTypes: ['image/'],
        maxSize: 5 * 1024 * 1024
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should accept file without restrictions', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = service.validateFile(file, {});
      expect(result.valid).toBe(true);
    });
  });

  describe('sanitizeJson', () => {
    it('should sanitize string values in objects', () => {
      const input = {
        name: 'John<script>alert(1)</script>',
        email: 'test@example.com'
      };
      const result = service.sanitizeJson(input);
      expect(result.name).not.toContain('<script>');
      expect(result.email).toBe('test@example.com');
    });

    it('should sanitize nested objects', () => {
      const input = {
        user: {
          name: 'John<script>',
          details: {
            bio: 'Developer<iframe>'
          }
        }
      };
      const result = service.sanitizeJson(input);
      expect(result.user.name).not.toContain('<script>');
      expect(result.user.details.bio).not.toContain('<iframe>');
    });

    it('should sanitize arrays', () => {
      const input = ['Hello<script>', 'World<iframe>'];
      const result = service.sanitizeJson(input);
      expect(result[0]).not.toContain('<script>');
      expect(result[1]).not.toContain('<iframe>');
    });

    it('should preserve non-string values', () => {
      const input = {
        count: 42,
        active: true,
        items: null
      };
      const result = service.sanitizeJson(input);
      expect(result.count).toBe(42);
      expect(result.active).toBe(true);
      expect(result.items).toBe(null);
    });
  });
});
