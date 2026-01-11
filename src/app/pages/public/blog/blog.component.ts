import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, PublicNavbarComponent, PublicFooterComponent],
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
      title: 'Blog | DevFlowFix - DevOps Insights & Tutorials',
      description: 'Read the latest articles on deployment automation, CI/CD best practices, Kubernetes, GitHub Actions, and AI-powered DevOps from the DevFlowFix team.',
      keywords: 'devflowfix blog, devops blog, CI/CD tutorials, kubernetes articles, github actions guide, deployment best practices',
      url: '/blog',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' }
    ]);

    this.seoService.addWebPageSchema({
      name: 'DevFlowFix Blog',
      description: 'DevOps insights, tutorials, and best practices from the DevFlowFix team',
      url: '/blog'
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
