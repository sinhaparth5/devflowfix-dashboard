import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../shared/services/seo.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, LottieComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {
  heroOptions: AnimationOptions = {
    path: '/lotties/hero.json',
    loop: true,
    autoplay: true
  };

  processOptions: AnimationOptions = {
    path: '/lotties/process.json',
    loop: true,
    autoplay: true
  };

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'DevFlowFix - Automated Deployment Failure Resolution',
      description: 'DevFlowFix automatically fixes 75% of deployment failures in under 8 minutes using AI-powered analysis and remediation. Integrates with GitHub Actions, ArgoCD, and Kubernetes.',
      keywords: 'devflowfix, deployment automation, kubernetes, github actions, argocd, AI remediation, deployment failures, NVIDIA NIM, CI/CD automation',
      url: '/',
      type: 'website'
    });

    // Add breadcrumb for home page
    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' }
    ]);
  }
}
