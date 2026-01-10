import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../shared/services/seo.service';
import { AuthService, UserResponse } from '../../shared/components/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styles: `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(-8deg); }
      50% { transform: translateY(-20px) rotate(-12deg); }
    }

    @keyframes floatCircle {
      0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
      50% { transform: translateY(-15px) scale(1.05) rotate(5deg); }
    }

    @keyframes floatTilted {
      0%, 100% { transform: translateY(0px) rotate(15deg); }
      50% { transform: translateY(-25px) rotate(18deg); }
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(-2deg); }
      50% { transform: rotate(2deg); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    .animate-float-circle {
      animation: floatCircle 4s ease-in-out infinite;
    }

    .animate-float-tilted {
      animation: floatTilted 7s ease-in-out infinite;
    }

    .animate-wiggle {
      animation: wiggle 3s ease-in-out infinite;
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
    }

    .animate-fade-in-left {
      animation: fadeInLeft 0.8s ease-out forwards;
    }

    .animate-fade-in-right {
      animation: fadeInRight 0.8s ease-out forwards;
    }

    .animate-pulse-slow {
      animation: pulse 3s ease-in-out infinite;
    }

    .animate-scale-in {
      animation: scaleIn 0.6s ease-out forwards;
    }

    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-400 { animation-delay: 0.4s; }
    .delay-500 { animation-delay: 0.5s; }
    .delay-600 { animation-delay: 0.6s; }

    .hover-lift {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .hover-lift:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .gradient-orange {
      background: linear-gradient(135deg, #ff8800 0%, #ffa333 100%);
    }

    .gradient-orange-soft {
      background: linear-gradient(135deg, #fff4e6 0%, #ffe8cc 100%);
    }

    /* Funky decorative elements */
    .funky-arrow {
      position: absolute;
      width: 60px;
      height: 60px;
      stroke: #ff8800;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
    }

    .funky-badge {
      position: absolute;
      width: 50px;
      height: 50px;
      background: white;
      border: 2px solid #333;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .doodle-circle {
      position: absolute;
      border: 2px solid #ff8800;
      border-radius: 50%;
      border-style: dashed;
    }

    /* Background Text */
    .bg-text {
      position: absolute;
      font-size: 12rem;
      font-weight: 900;
      color: rgba(255, 136, 0, 0.08);
      line-height: 1;
      pointer-events: none;
      user-select: none;
      z-index: 0;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .bg-text {
        font-size: 6rem;
      }
    }

    /* Marquee Container with proper height */
    .marquee-container {
      position: absolute;
      overflow: visible;
      width: 200%;
      height: auto;
      z-index: 0;
      left: -50%;
    }

    .scroll-text {
      position: absolute;
      font-size: 12rem;
      font-weight: 900;
      color: rgba(255, 136, 0, 0.08);
      line-height: 1;
      pointer-events: none;
      user-select: none;
      z-index: 0;
      white-space: nowrap;
      will-change: transform;
    }

    @media (max-width: 768px) {
      .scroll-text {
        font-size: 6rem;
      }
    }

    @keyframes parallaxUp {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-100px); }
    }

    @keyframes parallaxDown {
      0% { transform: translateY(0px); }
      100% { transform: translateY(100px); }
    }

    @keyframes rotate360 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }

    @keyframes marquee-reverse {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0%); }
    }

    /* Scroll-based animations */
    .scroll-move-left {
      animation: scrollMoveLeft 1s linear;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    }

    .scroll-move-right {
      animation: scrollMoveRight 1s linear;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    }

    @keyframes scrollMoveLeft {
      from { transform: translateX(0%); }
      to { transform: translateX(-30%); }
    }

    @keyframes scrollMoveRight {
      from { transform: translateX(-30%); }
      to { transform: translateX(0%); }
    }

    .animate-rotate-slow {
      animation: rotate360 30s linear infinite;
    }

    /* Scroll Animation States */
    .scroll-hidden {
      opacity: 0;
      transform: translateY(50px);
    }

    .scroll-visible {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }

    .scroll-visible-left {
      opacity: 1;
      transform: translateX(0);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }

    .scroll-visible-right {
      opacity: 1;
      transform: translateX(0);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }

    .scroll-hidden-left {
      opacity: 0;
      transform: translateX(-50px);
    }

    .scroll-hidden-right {
      opacity: 0;
      transform: translateX(50px);
    }

    .scroll-scale {
      opacity: 1;
      transform: scale(1);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    .scroll-scale-hidden {
      opacity: 0;
      transform: scale(0.9);
    }
  `
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren('scrollAnimate', { read: ElementRef }) scrollElements!: QueryList<ElementRef>;

  isLoggedIn = false;
  currentUser: UserResponse | null = null;
  private observer!: IntersectionObserver;

  constructor(
    private seoService: SeoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });

    // Use comprehensive home SEO with all structured data schemas
    this.seoService.setHomeSEO();

    // Add breadcrumb for home page
    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' }
    ]);
  }

  ngAfterViewInit(): void {
    // Setup Intersection Observer for scroll animations
    this.setupScrollAnimations();
    this.setupScrollTextAnimation();
  }

  private setupScrollAnimations(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;

          // Add the appropriate visible class based on the animation type
          if (element.classList.contains('scroll-hidden')) {
            element.classList.remove('scroll-hidden');
            element.classList.add('scroll-visible');
          } else if (element.classList.contains('scroll-hidden-left')) {
            element.classList.remove('scroll-hidden-left');
            element.classList.add('scroll-visible-left');
          } else if (element.classList.contains('scroll-hidden-right')) {
            element.classList.remove('scroll-hidden-right');
            element.classList.add('scroll-visible-right');
          } else if (element.classList.contains('scroll-scale-hidden')) {
            element.classList.remove('scroll-scale-hidden');
            element.classList.add('scroll-scale');
          }

          // Unobserve after animation to improve performance
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements with scroll animation classes
    const elementsToAnimate = document.querySelectorAll('.scroll-hidden, .scroll-hidden-left, .scroll-hidden-right, .scroll-scale-hidden');
    elementsToAnimate.forEach(el => this.observer.observe(el));
  }

  private setupScrollTextAnimation(): void {
    // Add scroll-based animation to background text
    window.addEventListener('scroll', () => {
      const scrollTexts = document.querySelectorAll('.scroll-text');
      const scrollY = window.scrollY;

      scrollTexts.forEach((text, index) => {
        const element = text as HTMLElement;
        const direction = element.dataset['direction'];
        const speed = parseFloat(element.dataset['speed'] || '0.5');

        if (direction === 'left') {
          element.style.transform = `translateX(-${scrollY * speed}px)`;
        } else {
          element.style.transform = `translateX(${scrollY * speed}px)`;
        }
      });
    });
  }

  ngOnDestroy(): void {
    // Cleanup observer
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
