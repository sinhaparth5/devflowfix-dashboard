import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, PublicNavbarComponent, PublicFooterComponent],
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
      title: 'About Us | DevFlowFix - Our Mission & Story',
      description: 'Learn about DevFlowFix, the AI-powered platform revolutionizing deployment failure resolution. Discover our mission to help developers ship faster with fewer incidents.',
      keywords: 'about devflowfix, deployment automation company, CI/CD innovation, DevOps tools, AI deployment resolution',
      url: '/about',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' }
    ]);

    this.seoService.addWebPageSchema({
      name: 'About DevFlowFix',
      description: 'Learn about our mission to revolutionize deployment failure resolution',
      url: '/about'
    });
  }
}
