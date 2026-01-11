import { Directive, ElementRef, Input, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
  @Input() animationType: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'scale' = 'fade-up';
  @Input() animationDelay: number = 0;
  @Input() animationDuration: number = 600;
  @Input() animationThreshold: number = 0.1;
  @Input() animationOnce: boolean = true;

  private observer: IntersectionObserver | null = null;
  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Apply initial hidden state based on animation type
    this.setInitialState();

    // Setup intersection observer
    this.setupObserver();
  }

  private setInitialState(): void {
    const element = this.el.nativeElement;
    element.style.opacity = '0';
    element.style.transition = `opacity ${this.animationDuration}ms ease, transform ${this.animationDuration}ms ease`;
    element.style.transitionDelay = `${this.animationDelay}ms`;

    switch (this.animationType) {
      case 'fade-up':
        element.style.transform = 'translateY(40px)';
        break;
      case 'fade-down':
        element.style.transform = 'translateY(-40px)';
        break;
      case 'fade-left':
        element.style.transform = 'translateX(-40px)';
        break;
      case 'fade-right':
        element.style.transform = 'translateX(40px)';
        break;
      case 'zoom-in':
      case 'scale':
        element.style.transform = 'scale(0.9)';
        break;
      case 'zoom-out':
        element.style.transform = 'scale(1.1)';
        break;
    }
  }

  private setupObserver(): void {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: this.animationThreshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIn();
          if (this.animationOnce && this.observer) {
            this.observer.unobserve(entry.target);
          }
        } else if (!this.animationOnce) {
          this.setInitialState();
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private animateIn(): void {
    const element = this.el.nativeElement;
    element.style.opacity = '1';
    element.style.transform = 'translate(0) scale(1)';
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
