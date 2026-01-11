import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [RouterModule, PublicNavbarComponent, PublicFooterComponent],
  templateUrl: './help-center.component.html',
  styles: ``
})
export class HelpCenterComponent implements OnInit {

  categories = [
    {
      title: 'Getting Started',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      articles: [
        'How to connect your GitHub repository',
        'Setting up your first webhook',
        'Understanding the dashboard',
        'Configuring notifications'
      ]
    },
    {
      title: 'Integrations',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      articles: [
        'GitHub Actions setup guide',
        'ArgoCD integration tutorial',
        'Kubernetes configuration',
        'Docker deployment monitoring'
      ]
    },
    {
      title: 'Troubleshooting',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      articles: [
        'Common deployment errors',
        'Webhook not receiving events',
        'Authentication issues',
        'API rate limiting'
      ]
    },
    {
      title: 'Account & Billing',
      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      articles: [
        'Managing your subscription',
        'Updating payment methods',
        'Team member access',
        'Invoice and receipts'
      ]
    }
  ];

  faqs = [
    {
      question: 'What is DevFlowFix?',
      answer: 'DevFlowFix is an AI-powered platform that automatically detects, analyzes, and resolves deployment failures in your CI/CD pipelines. It integrates with GitHub Actions, ArgoCD, and Kubernetes.'
    },
    {
      question: 'How does the AI analysis work?',
      answer: 'We use NVIDIA NIM-powered AI models to analyze error logs, stack traces, and deployment configurations. The AI identifies patterns and root causes, then suggests or automatically applies fixes.'
    },
    {
      question: 'Is my code secure?',
      answer: 'Yes, we take security seriously. We only access the minimum required permissions, all data is encrypted in transit and at rest, and we never store your source code.'
    },
    {
      question: 'What CI/CD platforms do you support?',
      answer: 'We currently support GitHub Actions, ArgoCD, and Kubernetes. We\'re actively working on adding support for GitLab CI, Jenkins, and CircleCI.'
    },
    {
      question: 'Can I use DevFlowFix with a private repository?',
      answer: 'Yes, DevFlowFix works with both public and private repositories. For private repos, you\'ll need to authorize access through our GitHub OAuth integration.'
    },
    {
      question: 'How do I get support?',
      answer: 'Free users can access community support through our Discord. Pro and Enterprise customers have priority email and chat support. Enterprise customers also get a dedicated support engineer.'
    }
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Help Center | DevFlowFix - Documentation & Support',
      description: 'Get help with DevFlowFix. Find guides, tutorials, FAQs, and troubleshooting tips for deployment automation and CI/CD integration.',
      keywords: 'devflowfix help, devflowfix documentation, deployment help, CI/CD support, GitHub Actions help, kubernetes troubleshooting',
      url: '/help-center',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Help Center', url: '/help-center' }
    ]);

    // Add FAQ schema
    this.seoService.addFAQSchema(this.faqs);
  }
}
