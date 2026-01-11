import { Component, OnInit, ViewChild } from '@angular/core';

import { SeoService } from '../../../shared/services/seo.service';
import { TokenRegistrationFormComponent } from '../../../shared/components/pr-management/token-registration-form/token-registration-form.component';
import { TokenListTableComponent } from '../../../shared/components/pr-management/token-list-table/token-list-table.component';
import { PRListTableComponent } from '../../../shared/components/pr-management/pr-list-table/pr-list-table.component';
import { PRDetailsModalComponent } from '../../../shared/components/pr-management/pr-details-modal/pr-details-modal.component';
import { PRStatsDashboardComponent } from '../../../shared/components/pr-management/pr-stats-dashboard/pr-stats-dashboard.component';

@Component({
  selector: 'app-pr-management',
  standalone: true,
  imports: [
    TokenRegistrationFormComponent,
    TokenListTableComponent,
    PRListTableComponent,
    PRDetailsModalComponent,
    PRStatsDashboardComponent
],
  templateUrl: './pr-management.component.html'
})
export class PrManagementComponent implements OnInit {
  activeTab: 'prs' | 'tokens' | 'stats' = 'prs';

  // Modal state for PR details
  isPRDetailsModalOpen = false;
  selectedPRId: string | null = null;

  // ViewChild reference to token list table for refreshing
  @ViewChild(TokenListTableComponent) tokenListTable?: TokenListTableComponent;

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // SEO setup
    this.seoService.updateSEO({
      title: 'PR Management | DevFlowFix Dashboard',
      description: 'Manage automated pull requests and GitHub tokens for DevFlowFix',
      keywords: 'pr management, github, pull requests, devflowfix, automation',
      url: '/dashboard/pr-management',
      type: 'website'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'PR Management', url: '/dashboard/pr-management' }
    ]);
  }

  /**
   * Switch between tabs
   */
  switchTab(tab: 'prs' | 'tokens' | 'stats'): void {
    this.activeTab = tab;
  }

  /**
   * Open PR details modal
   */
  openPRDetails(prId: string): void {
    this.selectedPRId = prId;
    this.isPRDetailsModalOpen = true;
  }

  /**
   * Close PR details modal
   */
  closePRDetailsModal(): void {
    this.isPRDetailsModalOpen = false;
    this.selectedPRId = null;
  }

  /**
   * Handle token registration - refresh token list
   */
  onTokenRegistered(): void {
    this.tokenListTable?.refresh();
  }
}
