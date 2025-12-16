import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { PrManagementService, PRDetails } from '../../../services/pr-management.service';

@Component({
  selector: 'app-pr-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    BadgeComponent
  ],
  templateUrl: './pr-details-modal.component.html'
})
export class PRDetailsModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() prId: string | null = null;
  @Output() close = new EventEmitter<void>();

  prDetails: PRDetails | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private prManagementService: PrManagementService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.prId) {
      this.loadPRDetails();
    } else if (changes['isOpen'] && !this.isOpen) {
      // Clear data when modal closes
      this.prDetails = null;
      this.errorMessage = '';
    }
  }

  /**
   * Load PR details from API
   */
  loadPRDetails(): void {
    if (!this.prId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.prManagementService.getPRDetails(this.prId).subscribe({
      next: (response) => {
        this.prDetails = response.pr;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading PR details:', error);
        this.errorMessage = error.error?.message || error.error?.detail || 'Failed to load PR details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Close the modal
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Open PR in GitHub
   */
  openPRInGitHub(): void {
    if (this.prDetails?.pr_url) {
      window.open(this.prDetails.pr_url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Get badge color based on status
   */
  getStatusBadgeColor(status: string): 'success' | 'error' | 'warning' {
    const statusLower = status.toLowerCase();

    if (statusLower === 'merged' || statusLower === 'approved') {
      return 'success';
    } else if (statusLower === 'closed' || statusLower === 'failed') {
      return 'error';
    } else {
      return 'warning';
    }
  }

  /**
   * Get badge color for confidence score
   */
  getConfidenceBadgeColor(score: number): 'success' | 'warning' | 'error' {
    if (score >= 0.8) {
      return 'success';
    } else if (score >= 0.6) {
      return 'warning';
    } else {
      return 'error';
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'N/A';
    }

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format confidence score as percentage
   */
  formatConfidence(score: number): string {
    return `${(score * 100).toFixed(1)}%`;
  }

  /**
   * Get Object for template
   */
  get Object() {
    return Object;
  }
}
