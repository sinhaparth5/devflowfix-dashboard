import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterModule, PublicNavbarComponent, PublicFooterComponent, ScrollAnimateDirective, NgOptimizedImage],
  templateUrl: './blog.component.html',
  styles: ``
})
export class BlogComponent implements OnInit {

  featuredPost = {
    title: 'How AI is Revolutionizing Deployment Failure Resolution',
    excerpt: 'Learn how modern AI models are changing the way development teams handle deployment failures and reduce downtime.',
    date: 'January 8, 2025',
    category: 'AI & DevOps',
    readTime: '8 min read',
    image: '/images/blog/ai-devops.jpg'
  };

  posts = [
    {
      title: 'Getting Started with GitHub Actions Integration',
      excerpt: 'A step-by-step guide to connecting DevFlowFix with your GitHub Actions workflows.',
      date: 'January 5, 2025',
      category: 'Tutorial',
      readTime: '5 min read'
    },
    {
      title: 'Best Practices for Kubernetes Deployment Monitoring',
      excerpt: 'Tips and strategies for effectively monitoring your Kubernetes deployments.',
      date: 'January 2, 2025',
      category: 'Best Practices',
      readTime: '6 min read'
    },
    {
      title: 'Understanding MTTR and Why It Matters',
      excerpt: 'Mean Time To Recovery is a critical metric. Here\'s how to measure and improve it.',
      date: 'December 28, 2024',
      category: 'Metrics',
      readTime: '4 min read'
    },
    {
      title: 'ArgoCD and GitOps: A Complete Guide',
      excerpt: 'Everything you need to know about implementing GitOps with ArgoCD.',
      date: 'December 22, 2024',
      category: 'Tutorial',
      readTime: '10 min read'
    },
    {
      title: 'Reducing Alert Fatigue in DevOps Teams',
      excerpt: 'Strategies for managing alerts effectively without overwhelming your team.',
      date: 'December 18, 2024',
      category: 'Best Practices',
      readTime: '5 min read'
    },
    {
      title: 'The Future of CI/CD Automation',
      excerpt: 'Predictions and trends shaping the future of continuous integration and deployment.',
      date: 'December 15, 2024',
      category: 'Industry',
      readTime: '7 min read'
    }
  ];

  categories = ['All', 'Tutorial', 'Best Practices', 'AI & DevOps', 'Metrics', 'Industry'];
  selectedCategory = 'All';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Blog | DevFlowFix - DevOps Insights, Tutorials & Best Practices',
      description: 'Expert articles on deployment automation, CI/CD best practices, Kubernetes monitoring, GitHub Actions integration, and AI-powered DevOps. Learn from the DevFlowFix team.',
      keywords: 'devflowfix blog, devops blog, CI/CD tutorials, kubernetes articles, github actions guide, deployment best practices, argocd gitops, deployment automation tips',
      url: '/blog',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' }
    ]);

    // Add Blog schema for better SEO
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'name': 'DevFlowFix Blog',
      'description': 'DevOps insights, tutorials, and best practices from the DevFlowFix team',
      'url': 'https://devflowfix.com/blog',
      'publisher': {
        '@type': 'Organization',
        'name': 'DevFlowFix',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://devflowfix.com/images/logo/logo.svg'
        }
      },
      'blogPost': this.posts.slice(0, 3).map(post => ({
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.excerpt,
        'datePublished': post.date,
        'author': {
          '@type': 'Organization',
          'name': 'DevFlowFix'
        }
      }))
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  get filteredPosts() {
    if (this.selectedCategory === 'All') {
      return this.posts;
    }
    return this.posts.filter(post => post.category === this.selectedCategory);
  }
}
