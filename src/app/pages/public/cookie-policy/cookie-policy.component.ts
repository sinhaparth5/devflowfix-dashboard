import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [RouterModule, PublicNavbarComponent, PublicFooterComponent, ScrollAnimateDirective],
  templateUrl: './cookie-policy.component.html'
})
export class CookiePolicyComponent implements OnInit {
  lastUpdated = 'January 12, 2026';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Cookie Policy | DevFlowFix',
      description: 'Learn about how DevFlowFix uses cookies and similar technologies. Understand your choices regarding cookie preferences.',
      keywords: 'cookie policy, cookies, tracking, devflowfix cookies, privacy',
      url: '/cookie-policy',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Cookie Policy', url: '/cookie-policy' }
    ]);
  }
}
