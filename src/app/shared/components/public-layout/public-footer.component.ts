import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="bg-gray-900 text-white relative overflow-hidden" role="contentinfo">

      <!-- ══ Toran hanging pendant border at top of footer ══ -->
      <div class="w-full overflow-hidden pointer-events-none" style="height:52px;" aria-hidden="true">
        <svg class="w-full" height="52" viewBox="0 0 1200 52" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="footerToran" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <!-- Horizontal bar -->
              <line x1="0" y1="3" x2="60" y2="3" stroke="#ff8800" stroke-width="1.5" opacity="0.35"/>
              <!-- Side beads -->
              <circle cx="10" cy="3" r="1.5" fill="#f59e0b" opacity="0.3"/>
              <circle cx="50" cy="3" r="1.5" fill="#f59e0b" opacity="0.3"/>
              <!-- Center bead on bar -->
              <circle cx="30" cy="3" r="2" fill="#ff8800" opacity="0.4"/>
              <!-- Hanging string -->
              <line x1="30" y1="3" x2="30" y2="16" stroke="#ff8800" stroke-width="0.8" opacity="0.3"/>
              <!-- Mango/ambi pendant -->
              <path d="M30,16 C24,22 22,36 27,42 C29,46 31,46 33,42 C38,36 36,22 30,16 Z" fill="#ff8800" opacity="0.18"/>
              <!-- Pendant inner highlight -->
              <path d="M30,19 C27,25 26,35 28,40" stroke="#f59e0b" stroke-width="0.6" fill="none" opacity="0.25"/>
              <!-- Pendant top bead -->
              <circle cx="30" cy="14" r="2.2" fill="#f59e0b" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="52" fill="url(#footerToran)"/>
        </svg>
      </div>

      <!-- ══ Subtle mandala watermark — far right background ══ -->
      <div class="absolute top-16 right-0 pointer-events-none" style="width:340px;height:340px;opacity:0.04;" aria-hidden="true">
        <svg viewBox="-170 -170 340 340" class="w-full h-full">
          <g stroke="#ff8800" fill="none">
            <circle r="160" stroke-width="0.75"/>
            <circle r="130" stroke-width="0.75"/>
            <circle r="100" stroke-width="0.75"/>
            <circle r="70" stroke-width="0.75"/>
            <circle r="40" stroke-width="0.75"/>
          </g>
          <g fill="#ff8800">
            <path d="M0,-150 C-18,-90 -18,-25 0,0 C18,-25 18,-90 0,-150"/>
            <path d="M0,-150 C-18,-90 -18,-25 0,0 C18,-25 18,-90 0,-150" transform="rotate(45)"/>
            <path d="M0,-150 C-18,-90 -18,-25 0,0 C18,-25 18,-90 0,-150" transform="rotate(90)"/>
            <path d="M0,-150 C-18,-90 -18,-25 0,0 C18,-25 18,-90 0,-150" transform="rotate(135)"/>
            <path d="M0,-150 C-18,-90 -18,-25 0,0 C18,-25 18,-90 0,-150" transform="rotate(180)"/>
            <path d="M0,-150 C-18,-90 -18,-25 0,0 C18,-25 18,-90 0,-150" transform="rotate(225)"/>
            <path d="M0,-150 C-18,-90 -18,-25 0,0 C18,-25 18,-90 0,-150" transform="rotate(270)"/>
            <path d="M0,-150 C-18,-90 -18,-25 0,0 C18,-25 18,-90 0,-150" transform="rotate(315)"/>
          </g>
        </svg>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-16 relative">
        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <!-- Company Info -->
          <div class="lg:col-span-2 relative">
            <a routerLink="/" class="flex items-center gap-2 mb-6 group" aria-label="DevFlowFix - Go to homepage">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <span class="text-xl font-bold group-hover:text-brand-400 transition-colors duration-300">
                DevFlow<span class="text-brand-500">Fix</span>
              </span>
            </a>
            <p class="text-gray-300 mb-6 max-w-sm leading-relaxed">
              AI-powered deployment automation that fixes 75% of failures in under 8 minutes. Built for modern DevOps teams.
            </p>
            <!-- Social Links -->
            <nav aria-label="Social media links">
              <div class="flex gap-3">
                <a href="https://twitter.com/devflowfix" target="_blank" rel="noopener noreferrer"
                   aria-label="Follow DevFlowFix on X (Twitter)"
                   class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-brand-500 hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300">
                  <svg class="size-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://github.com/devflowfix" target="_blank" rel="noopener noreferrer"
                   aria-label="View DevFlowFix on GitHub"
                   class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-brand-500 hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300">
                  <svg class="size-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/devflowfix" target="_blank" rel="noopener noreferrer"
                   aria-label="Connect with DevFlowFix on LinkedIn"
                   class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-brand-500 hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300">
                  <svg class="size-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </nav>
          </div>

          <!-- Product -->
          <nav aria-label="Product links">
            <h2 class="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Product</h2>
            <ul class="space-y-3" role="list">
              <li><a routerLink="/product" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">Features</a></li>
              <li><a routerLink="/pricing" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">Pricing</a></li>
              <li><a routerLink="/dashboard" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">Dashboard</a></li>
              <li><a routerLink="/signup" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">Get Started</a></li>
            </ul>
          </nav>

          <!-- Company -->
          <nav aria-label="Company links">
            <h2 class="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Company</h2>
            <ul class="space-y-3" role="list">
              <li><a routerLink="/about" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">About</a></li>
              <li><a routerLink="/blog" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">Blog</a></li>
              <li><a routerLink="/contact" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">Contact</a></li>
            </ul>
          </nav>

          <!-- Support -->
          <nav aria-label="Support links">
            <h2 class="font-semibold mb-4 text-white text-sm uppercase tracking-wider">Support</h2>
            <ul class="space-y-3" role="list">
              <li><a routerLink="/help-center" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">Help Center</a></li>
              <li><a href="mailto:support&#64;devflowfix.com" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200" aria-label="Email support at support@devflowfix.com">Email Support</a></li>
              <li><a routerLink="/contact" class="text-gray-200 hover:text-brand-400 hover:translate-x-1 inline-block transition-all duration-200">Contact Sales</a></li>
            </ul>
          </nav>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-8 border-t border-gray-800 relative">
          <!-- Mehndi divider accent along the top border -->
          <div class="absolute -top-px left-0 right-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <svg width="120" height="8" viewBox="0 0 120 8" style="opacity:0.45;">
              <line x1="0" y1="4" x2="120" y2="4" stroke="#ff8800" stroke-width="0.5" opacity="0.4"/>
              <g transform="translate(60,4)" fill="#ff8800" opacity="0.7">
                <path d="M0,-3 C-1,-1.5 -1,-0.3 0,0 C1,-0.3 1,-1.5 0,-3"/>
                <path d="M0,-3 C-1,-1.5 -1,-0.3 0,0 C1,-0.3 1,-1.5 0,-3" transform="rotate(90)"/>
                <path d="M0,-3 C-1,-1.5 -1,-0.3 0,0 C1,-0.3 1,-1.5 0,-3" transform="rotate(180)"/>
                <path d="M0,-3 C-1,-1.5 -1,-0.3 0,0 C1,-0.3 1,-1.5 0,-3" transform="rotate(270)"/>
              </g>
              <circle cx="30" cy="4" r="1.5" fill="#ff8800" opacity="0.4"/>
              <circle cx="90" cy="4" r="1.5" fill="#ff8800" opacity="0.4"/>
            </svg>
          </div>
          <!-- Corner rosettes on bottom bar -->
          <svg class="absolute bottom-0 left-0 w-5 h-5 pointer-events-none" viewBox="-8 -8 16 16" style="opacity:0.3;" aria-hidden="true">
            <g fill="#ff8800"><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(45)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(90)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(135)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(180)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(225)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(270)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(315)"/></g>
            <circle cx="0" cy="0" r="1.8" fill="#f59e0b"/>
          </svg>
          <svg class="absolute bottom-0 right-0 w-5 h-5 pointer-events-none" viewBox="-8 -8 16 16" style="opacity:0.3;" aria-hidden="true">
            <g fill="#ff8800"><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(45)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(90)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(135)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(180)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(225)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(270)"/><path d="M0,-6 C-1.8,-3.5 -1.8,-0.8 0,0 C1.8,-0.8 1.8,-3.5 0,-6" transform="rotate(315)"/></g>
            <circle cx="0" cy="0" r="1.8" fill="#f59e0b"/>
          </svg>

          <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            <p class="text-gray-300 text-sm">
              &copy; {{ currentYear }} DevFlowFix. All rights reserved.
            </p>
            <nav aria-label="Legal links">
              <div class="flex flex-wrap gap-6 text-sm">
                <a routerLink="/privacy-policy" class="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a routerLink="/terms-of-service" class="text-gray-300 hover:text-white transition-colors duration-200">Terms of Service</a>
                <a routerLink="/cookie-policy" class="text-gray-300 hover:text-white transition-colors duration-200">Cookie Policy</a>
              </div>
            </nav>
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
