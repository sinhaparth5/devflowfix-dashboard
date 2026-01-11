import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <!-- Company Info -->
          <div class="lg:col-span-2">
            <a routerLink="/" class="flex items-center gap-2 mb-6">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <span class="text-xl font-bold">
                DevFlow<span class="text-brand-500">Fix</span>
              </span>
            </a>
            <p class="text-gray-400 mb-6 max-w-sm">
              AI-powered deployment automation that fixes 75% of failures in under 8 minutes. Built for modern DevOps teams.
            </p>
            <!-- Social Links -->
            <div class="flex gap-4">
              <a href="https://twitter.com/devflowfix" target="_blank" rel="noopener"
                 class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://github.com/devflowfix" target="_blank" rel="noopener"
                 class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/devflowfix" target="_blank" rel="noopener"
                 class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Product -->
          <div>
            <h4 class="font-semibold mb-4 text-white">Product</h4>
            <ul class="space-y-3">
              <li><a routerLink="/product" class="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a routerLink="/pricing" class="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a routerLink="/dashboard" class="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a routerLink="/signup" class="text-gray-400 hover:text-white transition-colors">Get Started</a></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="font-semibold mb-4 text-white">Company</h4>
            <ul class="space-y-3">
              <li><a routerLink="/about" class="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a routerLink="/blog" class="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold mb-4 text-white">Support</h4>
            <ul class="space-y-3">
              <li><a routerLink="/help-center" class="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="mailto:support&#64;devflowfix.com" class="text-gray-400 hover:text-white transition-colors">Email Support</a></li>
              <li><a routerLink="/contact" class="text-gray-400 hover:text-white transition-colors">Contact Sales</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-8 border-t border-gray-800">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-gray-400 text-sm">
              &copy; {{ currentYear }} DevFlowFix. All rights reserved.
            </p>
            <div class="flex flex-wrap gap-6 text-sm">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: ``
})
export class PublicFooterComponent {
  currentYear = new Date().getFullYear();
}
