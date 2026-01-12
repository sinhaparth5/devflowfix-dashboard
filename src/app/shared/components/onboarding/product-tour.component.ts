import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OnboardingService, OnboardingStep } from '../../services/onboarding.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-tour',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (isActive && currentStep) {
      <!-- Backdrop overlay -->
      <div class="fixed inset-0 z-[9998] transition-opacity duration-300"
           [class.opacity-100]="isVisible"
           [class.opacity-0]="!isVisible">
        <!-- Dark overlay with spotlight cutout -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Spotlight highlight -->
        @if (spotlightStyle && currentStep.targetSelector) {
          <div class="absolute rounded-xl ring-4 ring-brand-500 ring-offset-4 ring-offset-transparent transition-all duration-500 ease-out shadow-2xl"
               [style.top.px]="spotlightStyle.top"
               [style.left.px]="spotlightStyle.left"
               [style.width.px]="spotlightStyle.width"
               [style.height.px]="spotlightStyle.height">
            <!-- Pulse animation -->
            <div class="absolute inset-0 rounded-xl animate-ping bg-brand-500/20"></div>
          </div>
        }
      </div>

      <!-- Tour popup card -->
      <div class="fixed z-[9999] transition-all duration-500 ease-out"
           [class.opacity-100]="isVisible"
           [class.opacity-0]="!isVisible"
           [class.scale-100]="isVisible"
           [class.scale-95]="!isVisible"
           [style.top.px]="tooltipPosition.top"
           [style.left.px]="tooltipPosition.left"
           [class.translate-x-[-50%]]="!currentStep.targetSelector"
           [class.translate-y-[-50%]]="!currentStep.targetSelector">

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-[380px] max-w-[90vw] overflow-hidden">
          <!-- Header with progress -->
          <div class="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-white/80 text-sm font-medium">
                Step {{ currentStepIndex + 1 }} of {{ totalSteps }}
              </span>
              <button (click)="dismiss()"
                      class="text-white/60 hover:text-white transition-colors"
                      aria-label="Close tour">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <!-- Progress bar -->
            <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-white rounded-full transition-all duration-500"
                   [style.width.%]="progressPercentage"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Icon -->
            @if (currentStep.icon) {
              <div class="w-14 h-14 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-7 h-7 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="currentStep.icon"/>
                </svg>
              </div>
            }

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ currentStep.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ currentStep.description }}
            </p>
          </div>

          <!-- Footer with navigation -->
          <div class="px-6 pb-6">
            <div class="flex items-center justify-between">
              <!-- Skip/back button -->
              <button (click)="handleBackOrSkip()"
                      class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                {{ isFirstStep ? 'Skip Tour' : 'Back' }}
              </button>

              <!-- Step indicators -->
              <div class="flex items-center gap-1.5">
                @for (step of steps; track step.id; let i = $index) {
                  <button (click)="goToStep(i)"
                          class="w-2 h-2 rounded-full transition-all duration-300"
                          [class.bg-brand-500]="i === currentStepIndex"
                          [class.w-6]="i === currentStepIndex"
                          [class.bg-gray-300]="i !== currentStepIndex"
                          [class.dark:bg-gray-600]="i !== currentStepIndex"
                          [class.hover:bg-brand-300]="i !== currentStepIndex"
                          [attr.aria-label]="'Go to step ' + (i + 1)">
                  </button>
                }
              </div>

              <!-- Next/finish button -->
              <button (click)="handleNext()"
                      class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2">
                {{ isLastStep ? 'Finish' : 'Next' }}
                @if (!isLastStep) {
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                } @else {
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                }
              </button>
            </div>
          </div>
        </div>

        <!-- Arrow pointer -->
        @if (currentStep.targetSelector && spotlightStyle) {
          <div class="absolute w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-gray-200 dark:border-gray-700"
               [class.border-t]="currentStep.position === 'bottom'"
               [class.border-l]="currentStep.position === 'bottom'"
               [class.border-b]="currentStep.position === 'top'"
               [class.border-r]="currentStep.position === 'top'"
               [class.-top-2]="currentStep.position === 'bottom'"
               [class.-bottom-2]="currentStep.position === 'top'"
               [class.left-10]="currentStep.position === 'bottom' || currentStep.position === 'top'">
          </div>
        }
      </div>
    }
  `,
  styles: [`
    :host {
      pointer-events: none;
    }

    :host > * {
      pointer-events: auto;
    }
  `]
})
export class ProductTourComponent implements OnInit, OnDestroy {
  isActive = false;
  isVisible = false;
  currentStep: OnboardingStep | null = null;
  currentStepIndex = 0;
  steps: OnboardingStep[] = [];
  totalSteps = 0;

  spotlightStyle: { top: number; left: number; width: number; height: number } | null = null;
  tooltipPosition = { top: 0, left: 0 };

  private isBrowser: boolean;
  private subscriptions: Subscription[] = [];
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private onboardingService: OnboardingService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.steps = this.onboardingService.tourSteps;
    this.totalSteps = this.steps.length;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.onboardingService.tourActive$.subscribe(active => {
        this.isActive = active;
        if (active) {
          setTimeout(() => {
            this.isVisible = true;
            this.updateCurrentStep();
          }, 100);
        } else {
          this.isVisible = false;
        }
      }),

      this.onboardingService.state$.subscribe(state => {
        this.currentStepIndex = state.currentStep;
        this.updateCurrentStep();
      })
    );

    // Setup resize observer for responsive positioning
    if (this.isBrowser && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isActive) {
          this.updatePositions();
        }
      });
      this.resizeObserver.observe(document.body);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isActive) {
      this.updatePositions();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isActive) return;

    switch (event.key) {
      case 'Escape':
        this.dismiss();
        break;
      case 'ArrowRight':
      case 'Enter':
        this.handleNext();
        break;
      case 'ArrowLeft':
        if (!this.isFirstStep) {
          this.onboardingService.previousStep();
        }
        break;
    }
  }

  get isFirstStep(): boolean {
    return this.onboardingService.isFirstStep();
  }

  get isLastStep(): boolean {
    return this.onboardingService.isLastStep();
  }

  get progressPercentage(): number {
    return ((this.currentStepIndex + 1) / this.totalSteps) * 100;
  }

  private updateCurrentStep(): void {
    this.currentStep = this.steps[this.currentStepIndex] || null;

    if (this.currentStep?.route && this.isBrowser) {
      // Navigate to the route if specified
      this.router.navigate([this.currentStep.route]).then(() => {
        setTimeout(() => this.updatePositions(), 300);
      });
    } else {
      this.updatePositions();
    }
  }

  private updatePositions(): void {
    if (!this.isBrowser || !this.currentStep) return;

    if (this.currentStep.targetSelector) {
      const targetElement = document.querySelector(this.currentStep.targetSelector);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const padding = 8;

        this.spotlightStyle = {
          top: rect.top - padding + window.scrollY,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2
        };

        // Position tooltip based on specified position
        this.positionTooltip(rect);
      } else {
        // Element not found, center the tooltip
        this.centerTooltip();
      }
    } else {
      // No target, center the tooltip
      this.spotlightStyle = null;
      this.centerTooltip();
    }
  }

  private positionTooltip(targetRect: DOMRect): void {
    const tooltipWidth = 380;
    const tooltipHeight = 300; // Approximate height
    const gap = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    switch (this.currentStep?.position) {
      case 'bottom':
        top = targetRect.bottom + gap + window.scrollY;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'top':
        top = targetRect.top - tooltipHeight - gap + window.scrollY;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2) + window.scrollY;
        left = targetRect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2) + window.scrollY;
        left = targetRect.right + gap;
        break;
      default:
        top = targetRect.bottom + gap + window.scrollY;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
    }

    // Keep tooltip within viewport bounds
    left = Math.max(16, Math.min(left, viewportWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, viewportHeight - tooltipHeight - 16 + window.scrollY));

    this.tooltipPosition = { top, left };
  }

  private centerTooltip(): void {
    if (!this.isBrowser) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 380;
    const tooltipHeight = 300;

    this.tooltipPosition = {
      top: (viewportHeight / 2) - (tooltipHeight / 2) + window.scrollY,
      left: (viewportWidth / 2) - (tooltipWidth / 2)
    };
  }

  handleBackOrSkip(): void {
    if (this.isFirstStep) {
      this.dismiss();
    } else {
      this.onboardingService.previousStep();
    }
  }

  handleNext(): void {
    if (this.isLastStep) {
      this.onboardingService.completeTour();
    } else {
      this.onboardingService.nextStep();
    }
  }

  dismiss(): void {
    this.isVisible = false;
    setTimeout(() => {
      this.onboardingService.dismissTour();
    }, 300);
  }

  goToStep(index: number): void {
    this.onboardingService.goToStep(index);
  }
}
