import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule, PublicNavbarComponent, PublicFooterComponent],
  templateUrl: './pricing.component.html',
  styles: ``
})
export class PricingComponent implements OnInit {

  plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for individual developers and small projects',
      features: [
        'Up to 100 deployments/month',
        'Basic AI analysis',
        'GitHub Actions integration',
        'Email notifications',
        'Community support'
      ],
      cta: 'Get Started Free',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: '/month',
      description: 'For growing teams who need more power',
      features: [
        'Unlimited deployments',
        'Advanced AI analysis',
        'All integrations (GitHub, ArgoCD, K8s)',
        'Slack & Teams notifications',
        'Priority support',
        'Custom remediation rules',
        'Team dashboard'
      ],
      cta: 'Start 14-Day Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Pro',
        'Dedicated support engineer',
        'Custom AI model training',
        'On-premise deployment option',
        'SSO/SAML integration',
        'SLA guarantees',
        'Advanced analytics & reporting'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  faqs = [
    {
      question: 'What counts as a deployment?',
      answer: 'A deployment is counted each time DevFlowFix analyzes a CI/CD pipeline run, regardless of whether it succeeds or fails.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.'
    },
    {
      question: 'Is there a free trial for Pro?',
      answer: 'Yes, we offer a 14-day free trial of Pro with all features included. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex) and can arrange invoicing for Enterprise customers.'
    }
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Pricing | DevFlowFix - Affordable Deployment Automation',
      description: 'Simple, transparent pricing for DevFlowFix. Start free, upgrade as you grow. Plans for individuals, teams, and enterprises.',
      keywords: 'devflowfix pricing, deployment automation cost, CI/CD tool pricing, free deployment tool, enterprise DevOps pricing',
      url: '/pricing',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Pricing', url: '/pricing' }
    ]);

    // Add pricing schema
    const pricingSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': 'DevFlowFix',
      'description': 'AI-powered deployment failure resolution platform',
      'offers': this.plans.map((plan, index) => ({
        '@type': 'Offer',
        'name': plan.name,
        'price': plan.price === 'Free' ? '0' : plan.price === 'Custom' ? '' : plan.price.replace('$', ''),
        'priceCurrency': 'USD',
        'description': plan.description
      }))
    };
  }
}
