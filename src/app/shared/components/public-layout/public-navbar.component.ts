import { Component, Input, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, ZitadelUser } from '../../../auth';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
         [class.bg-white/95]="isScrolled"
         [class.dark:bg-gray-900/95]="isScrolled"
         [class.shadow-lg]="isScrolled"
         [class.bg-white/90]="!isScrolled"
         [class.dark:bg-gray-900/90]="!isScrolled"
         [class.backdrop-blur-md]="true"
         [class.border-b]="true"
         [class.border-gray-200]="true"
         [class.dark:border-gray-800]="true"
         role="navigation"
         aria-label="Main navigation">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group" aria-label="DevFlowFix - Go to homepage">
            <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-brand-500/30">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors duration-300">
              DevFlow<span class="text-brand-500">Fix</span>
            </span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-1" role="menubar">
            <a routerLink="/"
               role="menuitem"
               [attr.aria-current]="activePage === 'home' ? 'page' : null"
               [class.text-brand-500]="activePage === 'home'"
               [class.font-semibold]="activePage === 'home'"
               [class.bg-brand-50]="activePage === 'home'"
               [class.dark:bg-brand-900/20]="activePage === 'home'"
               class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200">
              Home
            </a>
            <a routerLink="/product"
               role="menuitem"
               [attr.aria-current]="activePage === 'product' ? 'page' : null"
               [class.text-brand-500]="activePage === 'product'"
               [class.font-semibold]="activePage === 'product'"
               [class.bg-brand-50]="activePage === 'product'"
               [class.dark:bg-brand-900/20]="activePage === 'product'"
               class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200">
              Product
            </a>
            <a routerLink="/pricing"
               role="menuitem"
               [attr.aria-current]="activePage === 'pricing' ? 'page' : null"
               [class.text-brand-500]="activePage === 'pricing'"
               [class.font-semibold]="activePage === 'pricing'"
               [class.bg-brand-50]="activePage === 'pricing'"
               [class.dark:bg-brand-900/20]="activePage === 'pricing'"
               class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200">
              Pricing
            </a>
            <a routerLink="/about"
               role="menuitem"
               [attr.aria-current]="activePage === 'about' ? 'page' : null"
               [class.text-brand-500]="activePage === 'about'"
               [class.font-semibold]="activePage === 'about'"
               [class.bg-brand-50]="activePage === 'about'"
               [class.dark:bg-brand-900/20]="activePage === 'about'"
               class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200">
              About
            </a>
            <a routerLink="/blog"
               role="menuitem"
               [attr.aria-current]="activePage === 'blog' ? 'page' : null"
               [class.text-brand-500]="activePage === 'blog'"
               [class.font-semibold]="activePage === 'blog'"
               [class.bg-brand-50]="activePage === 'blog'"
               [class.dark:bg-brand-900/20]="activePage === 'blog'"
               class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200">
              Blog
            </a>
            <a routerLink="/contact"
               role="menuitem"
               [attr.aria-current]="activePage === 'contact' ? 'page' : null"
               [class.text-brand-500]="activePage === 'contact'"
               [class.font-semibold]="activePage === 'contact'"
               [class.bg-brand-50]="activePage === 'contact'"
               [class.dark:bg-brand-900/20]="activePage === 'contact'"
               class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200">
              Contact
            </a>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center gap-3">
            @if (isLoggedIn && currentUser) {
              <span class="hidden sm:block text-sm text-gray-700 dark:text-gray-300">
                Hi, {{ currentUser.name || currentUser.email }}
              </span>
              <a routerLink="/dashboard"
                 class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 hover:scale-105 hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300 active:scale-95">
                Dashboard
              </a>
            } @else {
              <a routerLink="/signin"
                 class="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-500 transition-colors duration-200">
                Sign In
              </a>
              <a routerLink="/signup"
                 class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 hover:scale-105 hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-300 active:scale-95">
                Get Started
              </a>
            }

            <!-- Mobile Menu Button -->
            <button (click)="toggleMobileMenu()"
                    class="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                    [attr.aria-expanded]="isMobileMenuOpen"
                    aria-controls="mobile-menu"
                    aria-label="Toggle navigation menu">
              <svg class="w-6 h-6 transition-transform duration-300" [class.rotate-90]="isMobileMenuOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                @if (isMobileMenuOpen) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (isMobileMenuOpen) {
          <div id="mobile-menu"
               class="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 animate-fadeIn"
               role="menu">
            <div class="flex flex-col gap-1">
              <a routerLink="/" (click)="closeMobileMenu()" role="menuitem"
                 class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200"
                 [class.bg-brand-50]="activePage === 'home'"
                 [class.text-brand-500]="activePage === 'home'">
                Home
              </a>
              <a routerLink="/product" (click)="closeMobileMenu()" role="menuitem"
                 class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200"
                 [class.bg-brand-50]="activePage === 'product'"
                 [class.text-brand-500]="activePage === 'product'">
                Product
              </a>
              <a routerLink="/pricing" (click)="closeMobileMenu()" role="menuitem"
                 class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200"
                 [class.bg-brand-50]="activePage === 'pricing'"
                 [class.text-brand-500]="activePage === 'pricing'">
                Pricing
              </a>
              <a routerLink="/about" (click)="closeMobileMenu()" role="menuitem"
                 class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200"
                 [class.bg-brand-50]="activePage === 'about'"
                 [class.text-brand-500]="activePage === 'about'">
                About
              </a>
              <a routerLink="/blog" (click)="closeMobileMenu()" role="menuitem"
                 class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200"
                 [class.bg-brand-50]="activePage === 'blog'"
                 [class.text-brand-500]="activePage === 'blog'">
                Blog
              </a>
              <a routerLink="/contact" (click)="closeMobileMenu()" role="menuitem"
                 class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200"
                 [class.bg-brand-50]="activePage === 'contact'"
                 [class.text-brand-500]="activePage === 'contact'">
                Contact
              </a>
              @if (!isLoggedIn) {
                <a routerLink="/signin" (click)="closeMobileMenu()" role="menuitem"
                   class="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all duration-200">
                  Sign In
                </a>
              }
            </div>
          </div>
        }
      </div>
    </nav>
    <!-- Spacer to prevent content from going under fixed navbar -->
    <div class="h-[72px]"></div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out;
    }
  `]
})
export class PublicNavbarComponent {
  @Input() activePage: string = '';

  private authService = inject(AuthService);
  isMobileMenuOpen = false;
  isScrolled = false;

  // Reactive auth state from Zitadel service
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser(): ZitadelUser | null {
    return this.authService.user();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
