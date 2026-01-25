import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';
import { CounterAnimateDirective } from '../../../shared/directives/counter-animate.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule, PublicNavbarComponent, PublicFooterComponent, ScrollAnimateDirective, CounterAnimateDirective],
  templateUrl: './about.component.html',
  styles: ``
})
export class AboutComponent implements OnInit {

  team = [
    {
      name: 'DevFlowFix Team',
      role: 'Engineering',
      description: 'Building the future of automated deployment resolution'
    }
  ];

  milestones = [
    { year: '2024', event: 'DevFlowFix founded with a mission to eliminate deployment failures' },
    { year: '2024', event: 'Launched AI-powered failure analysis using NVIDIA NIM' },
    { year: '2025', event: 'Integrated with GitHub Actions, ArgoCD, and Kubernetes' },
    { year: '2025', event: 'Achieved 75% automated resolution rate' }
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'About Us | DevFlowFix - Our Mission to Eliminate Deployment Failures',
      description: 'Meet the team behind DevFlowFix. Learn how we\'re using AI and NVIDIA NIM to revolutionize deployment failure resolution with 75% automated fix rate in under 8 minutes.',
      keywords: 'about devflowfix, deployment automation company, CI/CD innovation, DevOps tools, AI deployment resolution, NVIDIA NIM, automated deployment fixes',
      url: '/about',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' }
    ]);

    // Add Organization schema for about page
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About DevFlowFix',
      'description': 'Learn about our mission to revolutionize deployment failure resolution',
      'url': 'https://devflowfix.com/about',
      'mainEntity': {
        '@type': 'Organization',
        'name': 'DevFlowFix',
        'foundingDate': '2024',
        'description': 'AI-powered deployment failure resolution platform',
        'slogan': 'Fix Deployments Before They Break Production',
        'url': 'https://devflowfix.com',
        'sameAs': [
          'https://twitter.com/devflowfix',
          'https://github.com/devflowfix',
          'https://linkedin.com/company/devflowfix'
        ],
        'knowsAbout': [
          'Deployment Automation',
          'CI/CD',
          'Kubernetes',
          'GitHub Actions',
          'ArgoCD',
          'AI-powered DevOps'
        ]
      }
    });
  }
}
