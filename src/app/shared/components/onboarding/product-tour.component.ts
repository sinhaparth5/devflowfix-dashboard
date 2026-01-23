import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OnboardingService, OnboardingStep } from '../../services/onboarding.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-tour',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (isActive && currentStep) {
      <!-- Backdrop overlay with spotlight cutout using clip-path -->
      <div class="fixed inset-0 z-[9998] transition-opacity duration-300"
           [class.opacity-100]="isVisible"
           [class.opacity-0]="!isVisible">
        <!-- Dark overlay with cutout for highlighted element -->
        <div class="absolute inset-0 bg-black/70 transition-all duration-500"
             [style.clip-path]="spotlightClipPath"></div>

        <!-- Spotlight highlight ring (no blur on the element itself) -->
        @if (spotlightStyle && currentStep.targetSelector) {
          <div class="absolute rounded-xl ring-4 ring-brand-500 ring-offset-2 ring-offset-white/20 transition-all duration-500 ease-out"
               [style.top.px]="spotlightStyle.top"
               [style.left.px]="spotlightStyle.left"
               [style.width.px]="spotlightStyle.width"
               [style.height.px]="spotlightStyle.height"
               [style.box-shadow]="'0 0 30px rgba(99, 102, 241, 0.4)'">
            <!-- Subtle pulse animation -->
            <div class="absolute inset-0 rounded-xl animate-pulse bg-brand-500/10"></div>
          </div>
        }
      </div>

      <!-- Celebration overlay -->
      @if (showCelebration) {
        <div class="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center">
          <div class="celebration-container">
            @for (i of confettiPieces; track i) {
              <div class="confetti"
                   [style.left.%]="getRandomPosition(i)"
                   [style.animation-delay.ms]="i * 50"
                   [style.background-color]="getConfettiColor(i)">
              </div>
            }
          </div>
          <!-- Success message -->
          <div class="text-center animate-bounce-in">
            <div class="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Tour Complete!</h2>
            <p class="text-white/80">You're all set to explore</p>
          </div>
        </div>
      }

      <!-- Tour popup card -->
      <div #tooltipCard
           class="fixed z-[9999] transition-all duration-500 ease-out"
           [class.opacity-100]="isVisible"
           [class.opacity-0]="!isVisible"
           [class.scale-100]="isVisible"
           [class.scale-95]="!isVisible"
           [style.top.px]="tooltipPosition.top"
           [style.left.px]="tooltipPosition.left"
           [class.translate-x-[-50%]]="!currentStep.targetSelector"
           [class.translate-y-[-50%]]="!currentStep.targetSelector">

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-[360px] max-w-[calc(100vw-32px)] overflow-hidden">
          <!-- Header with progress -->
          <div class="bg-gradient-to-r from-brand-500 to-brand-600 px-4 sm:px-6 py-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-white/80 text-sm font-medium">
                Step {{ currentStepIndex + 1 }} of {{ totalSteps }}
              </span>
              <button (click)="dismiss()"
                      class="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                      aria-label="Close tour (Esc)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <!-- Progress bar -->
            <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-white rounded-full transition-all duration-500 ease-out"
                   [style.width.%]="progressPercentage"></div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-6">
            <!-- Icon -->
            @if (currentStep.icon) {
              <div class="w-12 h-12 sm:w-14 sm:h-14 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="currentStep.icon"/>
                </svg>
              </div>
            }

            <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ currentStep.title }}
            </h3>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ currentStep.description }}
            </p>
          </div>

          <!-- Footer with navigation -->
          <div class="px-4 sm:px-6 pb-4 sm:pb-6">
            <!-- Step indicators -->
            <div class="flex items-center justify-center gap-1.5 mb-4">
              @for (step of steps; track step.id; let i = $index) {
                <button (click)="goToStep(i)"
                        class="h-2 rounded-full transition-all duration-300"
                        [class.bg-brand-500]="i === currentStepIndex"
                        [class.w-6]="i === currentStepIndex"
                        [class.w-2]="i !== currentStepIndex"
                        [class.bg-gray-300]="i !== currentStepIndex"
                        [class.dark:bg-gray-600]="i !== currentStepIndex"
                        [class.hover:bg-brand-300]="i !== currentStepIndex"
                        [attr.aria-label]="'Go to step ' + (i + 1)"
                        [attr.aria-current]="i === currentStepIndex ? 'step' : null">
                </button>
              }
            </div>

            <!-- Navigation buttons -->
            <div class="flex items-center justify-between gap-3">
              <!-- Skip/back button -->
              <button (click)="handleBackOrSkip()"
                      class="flex-shrink-0 px-3 sm:px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                {{ isFirstStep ? 'Skip' : 'Back' }}
              </button>

              <!-- Next/finish button -->
              <button (click)="handleNext()"
                      #nextButton
                      class="flex-shrink-0 px-4 sm:px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
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

            <!-- Keyboard hints & Don't show again -->
            <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <!-- Don't show again checkbox -->
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox"
                         [(ngModel)]="dontShowAgain"
                         class="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 focus:ring-offset-0">
                  <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                    Don't show again
                  </span>
                </label>

                <!-- Keyboard hints -->
                <div class="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                  <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">←</kbd>
                  <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-mono">→</kbd>
                  <span>to navigate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

    /* Confetti animation */
    .celebration-container {
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      top: -10px;
      animation: confetti-fall 3s ease-out forwards;
    }

    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }

    /* Bounce in animation for success message */
    .animate-bounce-in {
      animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes bounce-in {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Step indicator buttons */
    button[aria-current="step"] {
      position: relative;
    }

    button[aria-current="step"]::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 9999px;
      border: 2px solid rgba(99, 102, 241, 0.3);
      animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.1);
      }
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
  dontShowAgain = false;
  showCelebration = false;
  confettiPieces = Array.from({ length: 50 }, (_, i) => i);

  spotlightStyle: { top: number; left: number; width: number; height: number } | null = null;
  tooltipPosition = { top: 0, left: 0 };
  spotlightClipPath: string = 'none';

  @ViewChild('tooltipCard') tooltipCard!: ElementRef<HTMLDivElement>;
  @ViewChild('nextButton') nextButton!: ElementRef<HTMLButtonElement>;

  private isBrowser: boolean;
  private subscriptions: Subscription[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private confettiColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

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
            // Focus the next button for accessibility
            setTimeout(() => this.nextButton?.nativeElement?.focus(), 100);
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

  @HostListener('window:scroll')
  onScroll(): void {
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
        event.preventDefault();
        this.handleNext();
        break;
      case 'ArrowLeft':
        event.preventDefault();
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

  getRandomPosition(index: number): number {
    return (index * 17) % 100;
  }

  getConfettiColor(index: number): string {
    return this.confettiColors[index % this.confettiColors.length];
  }

  private updateCurrentStep(): void {
    this.currentStep = this.steps[this.currentStepIndex] || null;

    if (this.currentStep?.route && this.isBrowser) {
      // Navigate to the route if specified
      this.router.navigate([this.currentStep.route]).then(() => {
        setTimeout(() => {
          this.scrollToTargetAndUpdate();
        }, 300);
      });
    } else {
      this.scrollToTargetAndUpdate();
    }
  }

  private scrollToTargetAndUpdate(): void {
    if (!this.isBrowser || !this.currentStep) return;

    if (this.currentStep.targetSelector) {
      const targetElement = document.querySelector(this.currentStep.targetSelector);

      if (targetElement) {
        // Scroll element into view with smooth animation
        const rect = targetElement.getBoundingClientRect();
        const isInViewport = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        );

        if (!isInViewport) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
          // Wait for scroll to complete before updating positions
          setTimeout(() => this.updatePositions(), 500);
        } else {
          this.updatePositions();
        }
      } else {
        this.updatePositions();
      }
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
        const padding = 12;

        this.spotlightStyle = {
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2
        };

        // Create clip-path to cut out the highlighted area (no blur/overlay on element)
        this.updateClipPath(this.spotlightStyle);

        // Position tooltip based on specified position
        this.positionTooltip(rect);
      } else {
        // Element not found, center the tooltip
        this.spotlightClipPath = 'none';
        this.centerTooltip();
      }
    } else {
      // No target, center the tooltip
      this.spotlightStyle = null;
      this.spotlightClipPath = 'none';
      this.centerTooltip();
    }
  }

  private updateClipPath(spotlight: { top: number; left: number; width: number; height: number }): void {
    const borderRadius = 12; // rounded-xl equivalent
    const { top, left, width, height } = spotlight;
    const right = left + width;
    const bottom = top + height;

    // Create a polygon that covers the entire viewport with a rounded rectangular cutout
    this.spotlightClipPath = `polygon(
      0% 0%,
      0% 100%,
      ${left}px 100%,
      ${left}px ${top + borderRadius}px,
      ${left + borderRadius}px ${top}px,
      ${right - borderRadius}px ${top}px,
      ${right}px ${top + borderRadius}px,
      ${right}px ${bottom - borderRadius}px,
      ${right - borderRadius}px ${bottom}px,
      ${left + borderRadius}px ${bottom}px,
      ${left}px ${bottom - borderRadius}px,
      ${left}px 100%,
      100% 100%,
      100% 0%
    )`;
  }

  private positionTooltip(targetRect: DOMRect): void {
    const tooltipWidth = Math.min(360, window.innerWidth - 32);
    const tooltipHeight = 380; // Approximate height with new elements
    const gap = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    // Determine best position based on available space
    const spaceAbove = targetRect.top;
    const spaceBelow = viewportHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = viewportWidth - targetRect.right;

    let position = this.currentStep?.position;

    // Auto-adjust position if not enough space
    if (!position) {
      if (spaceBelow >= tooltipHeight + gap) {
        position = 'bottom';
      } else if (spaceAbove >= tooltipHeight + gap) {
        position = 'top';
      } else if (spaceRight >= tooltipWidth + gap) {
        position = 'right';
      } else if (spaceLeft >= tooltipWidth + gap) {
        position = 'left';
      } else {
        position = 'bottom'; // Default fallback
      }
    }

    switch (position) {
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'top':
        top = targetRect.top - tooltipHeight - gap;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        left = targetRect.left - tooltipWidth - gap;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        left = targetRect.right + gap;
        break;
    }

    // Keep tooltip within viewport bounds
    left = Math.max(16, Math.min(left, viewportWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, viewportHeight - tooltipHeight - 16));

    this.tooltipPosition = { top, left };
  }

  private centerTooltip(): void {
    if (!this.isBrowser) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = Math.min(360, viewportWidth - 32);
    const tooltipHeight = 380;

    this.tooltipPosition = {
      top: (viewportHeight / 2) - (tooltipHeight / 2),
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
      this.completeTourWithCelebration();
    } else {
      this.onboardingService.nextStep();
    }
  }

  private completeTourWithCelebration(): void {
    this.showCelebration = true;

    // Hide the tour card
    this.isVisible = false;

    // Wait for celebration animation, then complete
    setTimeout(() => {
      this.showCelebration = false;
      this.onboardingService.completeTour(this.dontShowAgain);
    }, 2500);
  }

  dismiss(): void {
    this.isVisible = false;
    setTimeout(() => {
      this.onboardingService.dismissTour(this.dontShowAgain);
    }, 300);
  }

  goToStep(index: number): void {
    this.onboardingService.goToStep(index);
  }
}
