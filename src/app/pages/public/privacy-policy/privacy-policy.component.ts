import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterModule, PublicNavbarComponent, PublicFooterComponent, ScrollAnimateDirective],
  templateUrl: './privacy-policy.component.html'
})
export class PrivacyPolicyComponent implements OnInit {
  lastUpdated = 'January 12, 2026';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Privacy Policy | DevFlowFix',
      description: 'Learn how DevFlowFix collects, uses, and protects your personal information. Read our comprehensive privacy policy.',
      keywords: 'privacy policy, data protection, personal information, devflowfix privacy',
      url: '/privacy-policy',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Privacy Policy', url: '/privacy-policy' }
    ]);
  }
}
