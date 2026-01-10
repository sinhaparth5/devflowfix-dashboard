import { Component, OnInit } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SignupFormComponent } from '../../../shared/components/auth/signup-form/signup-form.component';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-sign-up',
  imports: [
    AuthPageLayoutComponent,
    SignupFormComponent,
  ],
  templateUrl: './sign-up.component.html',
  styles: ``
})
export class SignUpComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Update meta tags for sign up page
    this.seoService.updateSEO({
      title: 'Sign Up | DevFlowFix - Start Free Trial',
      description: 'Create your free DevFlowFix account and start automating deployment failure resolution. Fix 75% of deployment failures automatically with AI-powered analysis.',
      keywords: 'sign up, register, create account, devflowfix free trial, deployment automation signup, CI/CD tool registration',
      url: '/signup',
      type: 'website',
      robots: 'index, follow'
    });

    // Add breadcrumb for sign up page
    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Sign Up', url: '/signup' }
    ]);

    // Add WebPage schema
    this.seoService.addWebPageSchema({
      name: 'Create DevFlowFix Account',
      description: 'Sign up for free and start automating deployment failure resolution',
      url: '/signup'
    });
  }
}
