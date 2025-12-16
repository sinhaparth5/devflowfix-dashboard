import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { PrManagementService, GitHubToken } from '../../../services/pr-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-token-list-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputFieldComponent,
    BadgeComponent
  ],
  templateUrl: './token-list-table.component.html'
})
export class TokenListTableComponent implements OnInit, OnDestroy {
  tokens: GitHubToken[] = [];
  isLoading = false;
  errorMessage = '';

  // Filters
  filterOwner = '';
  activeOnly = true;

  // For external refresh triggers
  @Input() refreshTrigger?: Subscription;

  constructor(private prManagementService: PrManagementService) {}

  ngOnInit(): void {
    this.loadTokens();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Load tokens from API
   */
  loadTokens(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const owner = this.filterOwner.trim() || undefined;

    this.prManagementService.listTokens(owner, this.activeOnly).subscribe({
      next: (response) => {
        this.tokens = response.tokens;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tokens:', error);
        this.errorMessage = error.error?.message || error.error?.detail || 'Failed to load tokens. Please try again.';
        this.tokens = [];
        this.isLoading = false;
      }
    });
  }

  /**
   * Deactivate a token
   */
  deactivateToken(token: GitHubToken): void {
    const confirmMessage = `Are you sure you want to deactivate the token for ${token.owner}${token.repo ? '/' + token.repo : ''}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.prManagementService.deactivateToken(token.token_id).subscribe({
      next: (response) => {
        // Reload tokens after successful deactivation
        this.loadTokens();
      },
      error: (error) => {
        console.error('Error deactivating token:', error);
        const errorMsg = error.error?.message || error.error?.detail || 'Failed to deactivate token. Please try again.';
        alert(`Error: ${errorMsg}`);
      }
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get badge color based on active status
   */
  getBadgeColor(isActive: boolean): 'success' | 'error' {
    return isActive ? 'success' : 'error';
  }

  /**
   * Handle filter change
   */
  onFilterChange(): void {
    this.loadTokens();
  }

  /**
   * Handle active toggle change
   */
  onActiveToggleChange(): void {
    this.loadTokens();
  }

  /**
   * Public method to refresh tokens (called by parent)
   */
  refresh(): void {
    this.loadTokens();
  }
}
