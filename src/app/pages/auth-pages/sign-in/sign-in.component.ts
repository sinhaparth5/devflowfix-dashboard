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
    this.seoService.updateSEO({
      title: 'Sign In | DevFlowFix - Access Your Dashboard',
      description: 'Sign in to your DevFlowFix account to access your dashboard, manage projects, and collaborate with your team.',
      keywords: 'sign in, login, devflowfix login, access dashboard, user authentication',
      url: '/signin',
      robots: 'noindex, nofollow' // Auth pages should not be indexed
    });
  }
}
