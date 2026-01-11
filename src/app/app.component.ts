import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'DevFlowFix Dashboard | DevFlowFix';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setupGoogleAnalytics();
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
