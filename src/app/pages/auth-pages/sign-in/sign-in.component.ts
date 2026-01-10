import { Component, OnInit } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '../../../shared/components/auth/signin-form/signin-form.component';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-sign-in',
  imports: [
    AuthPageLayoutComponent,
    SigninFormComponent,
  ],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export class SignInComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Update meta tags for sign in page
    this.seoService.updateSEO({
      title: 'Sign In | DevFlowFix - Access Your Dashboard',
      description: 'Sign in to your DevFlowFix account to access the AI-powered deployment failure resolution dashboard. Manage incidents, track deployments, and automate fixes.',
      keywords: 'sign in, login, devflowfix login, deployment dashboard, CI/CD login, kubernetes dashboard login',
      url: '/signin',
      type: 'website',
      robots: 'index, follow'
    });

    // Add breadcrumb for sign in page
    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Sign In', url: '/signin' }
    ]);

    // Add WebPage schema
    this.seoService.addWebPageSchema({
      name: 'Sign In to DevFlowFix',
      description: 'Access your DevFlowFix dashboard to manage deployment failures and incidents',
      url: '/signin'
    });
  }
}
