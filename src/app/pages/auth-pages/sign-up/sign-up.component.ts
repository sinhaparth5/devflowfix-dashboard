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
    this.seoService.updateSEO({
      title: 'Sign Up | DevFlowFix - Create Your Free Account',
      description: 'Join DevFlowFix today! Create a free account and start managing your projects with our powerful dashboard and collaboration tools.',
      keywords: 'sign up, register, create account, devflowfix registration, free account',
      url: '/signup',
      robots: 'noindex, nofollow' // Auth pages should not be indexed
    });
  }
}
