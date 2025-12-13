import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { UserMetaCardComponent } from '../../shared/components/user-profile/user-meta-card/user-meta-card.component';
import { UserInfoCardComponent } from '../../shared/components/user-profile/user-info-card/user-info-card.component';
import { UserAddressCardComponent } from '../../shared/components/user-profile/user-address-card/user-address-card.component';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    UserMetaCardComponent,
    UserInfoCardComponent,
    UserAddressCardComponent,
  ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Profile | DevFlowFix - Manage Your Account',
      description: 'View and manage your DevFlowFix profile. Update your personal information, avatar, and account settings.',
      keywords: 'profile, account settings, user profile, account management, devflowfix',
      url: '/dashboard/profile',
      robots: 'noindex, nofollow' // Profile pages typically should not be indexed
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Profile', url: '/dashboard/profile' }
    ]);
  }
}
