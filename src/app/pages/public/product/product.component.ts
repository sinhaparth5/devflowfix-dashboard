import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';
import { CounterAnimateDirective } from '../../../shared/directives/counter-animate.directive';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, PublicNavbarComponent, PublicFooterComponent, ScrollAnimateDirective, CounterAnimateDirective],
  templateUrl: './product.component.html',
  styles: ``
})
export class ProductComponent implements OnInit {

  features = [
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'AI-Powered Analysis',
      description: 'NVIDIA NIM-powered AI analyzes deployment failures and identifies root causes in seconds.',
      color: 'brand'
    },
    {
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Automated Resolution',
      description: '75% of failures are resolved automatically without any human intervention.',
      color: 'green'
    },
    {
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      title: 'GitHub Actions Integration',
      description: 'Seamlessly integrates with your existing GitHub Actions workflows.',
      color: 'purple'
    },
    {
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      title: 'Kubernetes Support',
      description: 'Full support for Kubernetes deployments with intelligent pod analysis.',
      color: 'blue'
    },
    {
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      title: 'ArgoCD Integration',
      description: 'Native integration with ArgoCD for GitOps deployment monitoring.',
      color: 'orange'
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Real-Time Monitoring',
      description: 'Track all deployments in real-time with instant failure notifications.',
      color: 'red'
    }
  ];

  integrations = [
    { name: 'GitHub Actions', logo: 'github' },
    { name: 'ArgoCD', logo: 'argocd' },
    { name: 'Kubernetes', logo: 'kubernetes' },
    { name: 'Docker', logo: 'docker' }
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Product Features | DevFlowFix - AI-Powered Deployment Resolution',
      description: 'Discover DevFlowFix features: NVIDIA NIM AI analysis, 75% automated resolution rate, GitHub Actions & ArgoCD integration, Kubernetes support, and real-time deployment monitoring.',
      keywords: 'devflowfix features, deployment automation, AI failure analysis, GitHub Actions, Kubernetes, ArgoCD, NVIDIA NIM, CI/CD monitoring, automated deployment fix',
      url: '/product',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Product', url: '/product' }
    ]);

    // Add SoftwareApplication schema for product page
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'DevFlowFix',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web',
      'description': 'AI-powered platform that automatically fixes deployment failures with NVIDIA NIM integration',
      'url': 'https://devflowfix.com/product',
      'featureList': this.features.map(f => f.title),
      'softwareVersion': '1.0.0',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '127',
        'bestRating': '5',
        'worstRating': '1'
      }
    });
  }
}
