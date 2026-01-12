import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [RouterModule, PublicNavbarComponent, PublicFooterComponent, ScrollAnimateDirective],
  templateUrl: './terms-of-service.component.html'
})
export class TermsOfServiceComponent implements OnInit {
  lastUpdated = 'January 12, 2026';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Terms of Service | DevFlowFix',
      description: 'Read the Terms of Service for DevFlowFix. Understand your rights and responsibilities when using our deployment automation platform.',
      keywords: 'terms of service, user agreement, legal terms, devflowfix terms',
      url: '/terms-of-service',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Terms of Service', url: '/terms-of-service' }
    ]);
  }
}
