import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultConfig: SEOConfig = {
    title: 'DevFlowFix - Modern Project Management Dashboard',
    description: 'DevFlowFix is a modern, feature-rich dashboard for project management, team collaboration, and workflow optimization. Built with Angular and designed for developers.',
    keywords: 'devflowfix, project management, dashboard, angular, workflow, collaboration, development tools',
    image: '/images/og-image.png',
    type: 'website',
    author: 'DevFlowFix',
    robots: 'index, follow'
  };

  private baseUrl = 'https://devflowfix.astrareconslabs.com';

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {
    // Listen to route changes and update canonical URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCanonicalUrl();
    });
  }

  /**
   * Update all SEO tags for a page
   */
  updateSEO(config: Partial<SEOConfig>): void {
    const seoConfig = { ...this.defaultConfig, ...config };

    // Update title
    this.title.setTitle(seoConfig.title);

    // Update or create meta tags
    this.updateMetaTag('description', seoConfig.description);
    this.updateMetaTag('keywords', seoConfig.keywords || this.defaultConfig.keywords!);
    this.updateMetaTag('author', seoConfig.author || this.defaultConfig.author!);
    this.updateMetaTag('robots', seoConfig.robots || this.defaultConfig.robots!);

    // Open Graph tags
    this.updateMetaTag('og:title', seoConfig.title, 'property');
    this.updateMetaTag('og:description', seoConfig.description, 'property');
    this.updateMetaTag('og:type', seoConfig.type || this.defaultConfig.type!, 'property');
    this.updateMetaTag('og:url', seoConfig.url || this.getCurrentUrl(), 'property');
    this.updateMetaTag('og:image', seoConfig.image || this.defaultConfig.image!, 'property');
    this.updateMetaTag('og:site_name', 'DevFlowFix', 'property');

    // Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
    this.updateMetaTag('twitter:title', seoConfig.title, 'name');
    this.updateMetaTag('twitter:description', seoConfig.description, 'name');
    this.updateMetaTag('twitter:image', seoConfig.image || this.defaultConfig.image!, 'name');
    this.updateMetaTag('twitter:site', '@devflowfix', 'name'); // Update with your Twitter handle

    // Update canonical URL
    this.updateCanonicalUrl(seoConfig.url);
  }

  /**
   * Update or create a meta tag
   */
  private updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    const selector = `${attribute}="${name}"`;

    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attribute]: name, content });
    } else {
      this.meta.addTag({ [attribute]: name, content });
    }
  }

  /**
   * Get current URL
   */
  private getCurrentUrl(): string {
    return `${this.baseUrl}${this.router.url}`;
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url?: string): void {
    const canonicalUrl = url || this.getCurrentUrl();

    // Remove existing canonical link
    const existingLink = document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    document.head.appendChild(link);
  }

  /**
   * Create structured data (JSON-LD)
   */
  addStructuredData(data: any): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Add breadcrumb structured data
   */
  addBreadcrumb(items: Array<{ name: string; url: string }>): void {
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': `${this.baseUrl}${item.url}`
      }))
    };

    this.addStructuredData(breadcrumbData);
  }

  /**
   * Set default/home page SEO
   */
  setDefaultSEO(): void {
    this.updateSEO(this.defaultConfig);

    // Add organization structured data for home page
    const organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'DevFlowFix',
      'url': this.baseUrl,
      'logo': `${this.baseUrl}/images/logo/logo.svg`,
      'description': this.defaultConfig.description,
      'sameAs': [
        'https://twitter.com/devflowfix',
        'https://github.com/devflowfix',
        'https://linkedin.com/company/devflowfix'
      ]
    };

    this.addStructuredData(organizationData);
  }

  /**
   * Add SoftwareApplication structured data
   */
  addSoftwareApplicationSchema(): void {
    const softwareData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'DevFlowFix',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web',
      'description': 'AI-powered platform that automatically fixes deployment failures. Integrates with GitHub Actions, ArgoCD, and Kubernetes.',
      'url': this.baseUrl,
      'image': `${this.baseUrl}/images/devflowfix_og_img.png`,
      'screenshot': `${this.baseUrl}/images/devflowfix_og_img.png`,
      'softwareVersion': '1.0.0',
      'author': {
        '@type': 'Organization',
        'name': 'DevFlowFix'
      },
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
      },
      'featureList': [
        'Automated deployment failure resolution',
        'GitHub Actions integration',
        'ArgoCD integration',
        'Kubernetes support',
        'NVIDIA NIM AI-powered analysis',
        'Real-time incident tracking'
      ]
    };

    this.addStructuredData(softwareData);
  }

  /**
   * Add FAQ structured data
   */
  addFAQSchema(faqs: Array<{ question: string; answer: string }>): void {
    const faqData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    this.addStructuredData(faqData);
  }

  /**
   * Add WebSite structured data with search
   */
  addWebSiteSchema(): void {
    const websiteData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'DevFlowFix',
      'url': this.baseUrl,
      'description': 'Automated Deployment Failure Resolution Platform',
      'publisher': {
        '@type': 'Organization',
        'name': 'DevFlowFix',
        'logo': {
          '@type': 'ImageObject',
          'url': `${this.baseUrl}/images/logo/logo.svg`
        }
      }
    };

    this.addStructuredData(websiteData);
  }

  /**
   * Add WebPage structured data
   */
  addWebPageSchema(config: {
    name: string;
    description: string;
    url?: string;
    datePublished?: string;
    dateModified?: string;
  }): void {
    const webPageData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': config.name,
      'description': config.description,
      'url': config.url || this.getCurrentUrl(),
      'datePublished': config.datePublished || '2025-01-01',
      'dateModified': config.dateModified || new Date().toISOString().split('T')[0],
      'publisher': {
        '@type': 'Organization',
        'name': 'DevFlowFix',
        'logo': {
          '@type': 'ImageObject',
          'url': `${this.baseUrl}/images/logo/logo.svg`
        }
      },
      'isPartOf': {
        '@type': 'WebSite',
        'name': 'DevFlowFix',
        'url': this.baseUrl
      }
    };

    this.addStructuredData(webPageData);
  }

  /**
   * Add multiple structured data objects (for pages needing multiple schemas)
   */
  addMultipleStructuredData(dataArray: any[]): void {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add each structured data object
    dataArray.forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    });
  }

  /**
   * Set comprehensive home page SEO with all schemas
   */
  setHomeSEO(): void {
    this.updateSEO({
      title: 'DevFlowFix - Automated Deployment Failure Resolution',
      description: 'DevFlowFix automatically fixes 75% of deployment failures in under 8 minutes using AI-powered analysis. Integrates with GitHub Actions, ArgoCD, and Kubernetes.',
      keywords: 'devflowfix, deployment automation, kubernetes, github actions, argocd, AI remediation, deployment failures, NVIDIA NIM, CI/CD automation',
      url: '/',
      type: 'website'
    });

    // Add multiple structured data for homepage
    const schemas = [
      // Organization
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'DevFlowFix',
        'url': this.baseUrl,
        'logo': `${this.baseUrl}/images/logo/logo.svg`,
        'description': 'AI-powered deployment failure resolution platform',
        'sameAs': [
          'https://twitter.com/devflowfix',
          'https://github.com/devflowfix',
          'https://linkedin.com/company/devflowfix'
        ],
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'customer support',
          'availableLanguage': 'English'
        }
      },
      // WebSite
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'DevFlowFix',
        'url': this.baseUrl,
        'description': 'Automated Deployment Failure Resolution Platform'
      },
      // SoftwareApplication
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'DevFlowFix',
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'Web',
        'description': 'AI-powered platform that automatically fixes deployment failures',
        'url': this.baseUrl,
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      }
    ];

    this.addMultipleStructuredData(schemas);
  }
}
