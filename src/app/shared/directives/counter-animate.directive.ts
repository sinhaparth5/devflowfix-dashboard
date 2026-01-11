import { Directive, ElementRef, Input, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appCounterAnimate]',
  standalone: true
})
export class CounterAnimateDirective implements OnInit, OnDestroy {
  @Input() targetValue: number = 0;
  @Input() duration: number = 2000;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() decimals: number = 0;

  private observer: IntersectionObserver | null = null;
  private isBrowser: boolean;
  private hasAnimated: boolean = false;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      // For SSR, just show the final value
      this.el.nativeElement.textContent = `${this.prefix}${this.targetValue}${this.suffix}`;
      return;
    }

    // Set initial value to 0
    this.el.nativeElement.textContent = `${this.prefix}0${this.suffix}`;

    // Setup intersection observer
    this.setupObserver();
  }

  private setupObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCounter();
          if (this.observer) {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private animateCounter(): void {
    const startTime = performance.now();
    const startValue = 0;
    const endValue = this.targetValue;

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentValue = startValue + (endValue - startValue) * easedProgress;
      const displayValue = this.decimals > 0
        ? currentValue.toFixed(this.decimals)
        : Math.floor(currentValue);

      this.el.nativeElement.textContent = `${this.prefix}${displayValue}${this.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure final value is exact
        const finalValue = this.decimals > 0
          ? endValue.toFixed(this.decimals)
          : endValue;
        this.el.nativeElement.textContent = `${this.prefix}${finalValue}${this.suffix}`;
      }
    };

    requestAnimationFrame(updateCounter);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
