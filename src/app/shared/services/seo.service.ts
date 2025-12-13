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

  private baseUrl = 'https://devflowfix.com'; // Update with your actual domain

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
        'https://twitter.com/devflowfix', // Update with your social media
        'https://github.com/devflowfix',
        'https://linkedin.com/company/devflowfix'
      ]
    };

    this.addStructuredData(organizationData);
  }
}
