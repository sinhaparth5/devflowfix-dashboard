import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class SanitizationValidators {

  /**
   * Validate that input doesn't contain HTML tags
   */
  static noHtml(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasHtml = /<[^>]*>/g.test(value);

      return hasHtml ? { htmlDetected: { value } } : null;
    };
  }

  /**
   * Validate that input doesn't contain script tags or javascript:
   */
  static noScript(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();

      if (!value) {
        return null;
      }

      const hasScript =
        value.includes('<script') ||
        value.includes('javascript:') ||
        value.includes('onerror=') ||
        value.includes('onload=');

      return hasScript ? { scriptDetected: { value: control.value } } : null;
    };
  }

  /**
   * Validate URL is safe (no javascript:, data:, etc.)
   */
  static safeUrl(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();

      if (!value) {
        return null;
      }

      const dangerousProtocols = [
        'javascript:',
        'data:',
        'vbscript:',
        'file:',
        'about:'
      ];

      const isDangerous = dangerousProtocols.some(protocol =>
        value.startsWith(protocol)
      );

      return isDangerous ? { unsafeUrl: { value: control.value } } : null;
    };
  }

  /**
   * Validate that string length is within bounds (prevent DOS)
   */
  static maxLength(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      return value.length > max ? { maxLengthExceeded: { max, actual: value.length } } : null;
    };
  }

  /**
   * Combine multiple sanitization validators
   */
  static safe(): ValidatorFn[] {
    return [
      this.noHtml(),
      this.noScript(),
      this.maxLength(10000)
    ];
  }
}
