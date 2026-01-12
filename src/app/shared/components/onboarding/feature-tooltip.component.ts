import { Component, Input, OnInit, OnDestroy, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-feature-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div class="absolute z-50 animate-fade-in"
           [class.bottom-full]="position === 'top'"
           [class.top-full]="position === 'bottom'"
           [class.right-full]="position === 'left'"
           [class.left-full]="position === 'right'"
           [class.mb-2]="position === 'top'"
           [class.mt-2]="position === 'bottom'"
           [class.mr-2]="position === 'left'"
           [class.ml-2]="position === 'right'"
           [class.left-1/2]="position === 'top' || position === 'bottom'"
           [class.-translate-x-1/2]="position === 'top' || position === 'bottom'"
           [class.top-1/2]="position === 'left' || position === 'right'"
           [class.-translate-y-1/2]="position === 'left' || position === 'right'">

        <div class="bg-gray-900 dark:bg-gray-700 text-white rounded-xl shadow-xl p-4 w-64 relative">
          <!-- New badge -->
          @if (isNew) {
            <span class="absolute -top-2 -right-2 px-2 py-0.5 bg-brand-500 text-white text-xs font-bold rounded-full">
              NEW
            </span>
          }

          <!-- Close button -->
          <button (click)="close()"
                  class="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Content -->
          <div class="pr-6">
            @if (icon) {
              <div class="w-8 h-8 bg-brand-500/20 rounded-lg flex items-center justify-center mb-2">
                <svg class="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="icon"/>
                </svg>
              </div>
            }
            <h4 class="font-semibold text-sm mb-1">{{ title }}</h4>
            <p class="text-gray-300 text-xs leading-relaxed">{{ description }}</p>
          </div>

          <!-- Action button -->
          @if (actionText) {
            <button (click)="onAction()"
                    class="mt-3 w-full px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors">
              {{ actionText }}
            </button>
          }

          <!-- Arrow pointer -->
          <div class="absolute w-3 h-3 bg-gray-900 dark:bg-gray-700 transform rotate-45"
               [class.bottom-[-6px]]="position === 'top'"
               [class.top-[-6px]]="position === 'bottom'"
               [class.right-[-6px]]="position === 'left'"
               [class.left-[-6px]]="position === 'right'"
               [class.left-1/2]="position === 'top' || position === 'bottom'"
               [class.-translate-x-1/2]="position === 'top' || position === 'bottom'"
               [class.top-1/2]="position === 'left' || position === 'right'"
               [class.-translate-y-1/2]="position === 'left' || position === 'right'">
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      position: relative;
      display: inline-block;
    }

    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.2s ease-out forwards;
    }
  `]
})
export class FeatureTooltipComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() description = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() icon?: string;
  @Input() isNew = false;
  @Input() actionText?: string;
  @Input() actionCallback?: () => void;
  @Input() storageKey?: string; // If provided, will remember when dismissed

  isVisible = false;
  private isBrowser: boolean;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && this.storageKey) {
      const dismissed = localStorage.getItem(`feature_tooltip_${this.storageKey}`);
      if (!dismissed) {
        setTimeout(() => this.show(), 500);
      }
    } else if (this.isBrowser) {
      setTimeout(() => this.show(), 500);
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }

  show(): void {
    this.isVisible = true;
  }

  hide(): void {
    this.isVisible = false;
  }

  close(): void {
    this.hide();
    if (this.isBrowser && this.storageKey) {
      localStorage.setItem(`feature_tooltip_${this.storageKey}`, 'true');
    }
  }

  onAction(): void {
    if (this.actionCallback) {
      this.actionCallback();
    }
    this.close();
  }
}
