import { Component, OnInit, Input } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AuthService, UserResponse } from '../auth/auth.service';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">
              DevFlow<span class="text-brand-500">Fix</span>
            </span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/"
               [class.text-brand-500]="activePage === 'home'"
               [class.font-semibold]="activePage === 'home'"
               class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors">
              Home
            </a>
            <a routerLink="/product"
               [class.text-brand-500]="activePage === 'product'"
               [class.font-semibold]="activePage === 'product'"
               class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors">
              Product
            </a>
            <a routerLink="/pricing"
               [class.text-brand-500]="activePage === 'pricing'"
               [class.font-semibold]="activePage === 'pricing'"
               class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors">
              Pricing
            </a>
            <a routerLink="/about"
               [class.text-brand-500]="activePage === 'about'"
               [class.font-semibold]="activePage === 'about'"
               class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors">
              About
            </a>
            <a routerLink="/blog"
               [class.text-brand-500]="activePage === 'blog'"
               [class.font-semibold]="activePage === 'blog'"
               class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors">
              Blog
            </a>
            <a routerLink="/contact"
               [class.text-brand-500]="activePage === 'contact'"
               [class.font-semibold]="activePage === 'contact'"
               class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors">
              Contact
            </a>
          </div>

          <!-- Auth Buttons -->
          <div class="flex items-center gap-4">
            @if (isLoggedIn && currentUser) {
              <span class="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                Hi, {{ currentUser.full_name || currentUser.email }}
              </span>
              <a routerLink="/dashboard"
                 class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-all hover:shadow-lg">
                Dashboard
              </a>
            } @else {
              <a routerLink="/signin"
                 class="hidden sm:block text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors">
                Sign In
              </a>
              <a routerLink="/signup"
                 class="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-all hover:shadow-lg">
                Get Started
              </a>
            }

            <!-- Mobile Menu Button -->
            <button (click)="toggleMobileMenu()" class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-brand-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div class="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex flex-col gap-4">
              <a routerLink="/" (click)="closeMobileMenu()" class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500">Home</a>
              <a routerLink="/product" (click)="closeMobileMenu()" class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500">Product</a>
              <a routerLink="/pricing" (click)="closeMobileMenu()" class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500">Pricing</a>
              <a routerLink="/about" (click)="closeMobileMenu()" class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500">About</a>
              <a routerLink="/blog" (click)="closeMobileMenu()" class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500">Blog</a>
              <a routerLink="/contact" (click)="closeMobileMenu()" class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500">Contact</a>
              @if (!isLoggedIn) {
                <a routerLink="/signin" (click)="closeMobileMenu()" class="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-500">Sign In</a>
              }
            </div>
          </div>
        }
      </div>
    </nav>
  `,
  styles: ``
})
export class PublicNavbarComponent implements OnInit {
  @Input() activePage: string = '';

  isLoggedIn = false;
  currentUser: UserResponse | null = null;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
