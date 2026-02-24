import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CookieConsentComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'DevFlowFix Dashboard | DevFlowFix';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.isBrowser) {
      this.setupGoogleAnalytics();
    }
  }

  private setupGoogleAnalytics(): void {
    // Track page views on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (typeof gtag !== 'undefined') {
        gtag('config', 'G-LPNVX4RD1L', {
          page_path: event.urlAfterRedirects,
          page_title: document.title
        });
      }
    });
  }
}
