import { Directive, ElementRef, HostListener, Input, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SanitizationService } from '../services/sanitization.service';

@Directive({
  selector: '[appSanitizeInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SanitizeInputDirective),
      multi: true
    }
  ]
})
export class SanitizeInputDirective implements ControlValueAccessor {
  @Input() sanitizeType: 'text' | 'email' | 'url' = 'text';
  @Input() sanitizeOnBlur: boolean = true;
  @Input() sanitizeOnInput: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private sanitizationService: SanitizationService
  ) {}

  @HostListener('blur')
  onBlur(): void {
    if (this.sanitizeOnBlur) {
      this.sanitizeValue();
    }
    this.onTouched();
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    if (this.sanitizeOnInput) {
      this.sanitizeValue();
    }
  }

  private sanitizeValue(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const originalValue = input.value;
    let sanitizedValue = originalValue;

    switch (this.sanitizeType) {
      case 'text':
        sanitizedValue = this.sanitizationService.sanitizeText(originalValue);
        break;
      case 'email':
        sanitizedValue = this.sanitizationService.sanitizeEmail(originalValue);
        break;
      case 'url':
        sanitizedValue = this.sanitizationService.sanitizeUrl(originalValue);
        break;
    }

    if (sanitizedValue !== originalValue) {
      this.renderer.setProperty(input, 'value', sanitizedValue);
      this.onChange(sanitizedValue);
    }
  }

  writeValue(value: string): void {
    if (value !== null && value !== undefined) {
      this.renderer.setProperty(this.el.nativeElement, 'value', value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }
}
