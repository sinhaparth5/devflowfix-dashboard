import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { InputFieldComponent } from '../../form/input/input-field.component';
import { SelectComponent } from '../../form/select/select.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { PrManagementService, PullRequest, PRListParams } from '../../../services/pr-management.service';

@Component({
  selector: 'app-pr-list-table',
  standalone: true,
  imports: [
    InputFieldComponent,
    SelectComponent,
    BadgeComponent
],
  templateUrl: './pr-list-table.component.html'
})
export class PRListTableComponent implements OnInit {
  prs: PullRequest[] = [];
  total = 0;
  isLoading = false;
  errorMessage = '';

  // Filters
  incidentIdFilter = '';
  repositoryFilter = '';
  statusFilter = '';

  // Pagination
  skip = 0;
  limit = 20;
  currentPage = 1;
  totalPages = 0;

  // Status options for filter dropdown
  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'created', label: 'Created' },
    { value: 'open', label: 'Open' },
    { value: 'draft', label: 'Draft' },
    { value: 'review_requested', label: 'Review Requested' },
    { value: 'approved', label: 'Approved' },
    { value: 'merged', label: 'Merged' },
    { value: 'closed', label: 'Closed' },
    { value: 'failed', label: 'Failed' }
  ];

  @Output() viewDetails = new EventEmitter<string>();

  constructor(private prManagementService: PrManagementService) {}

  ngOnInit(): void {
    this.loadPRs();
  }

  /**
   * Load PRs from API
   */
  loadPRs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const params: PRListParams = {
      skip: this.skip,
      limit: this.limit
    };

    if (this.incidentIdFilter.trim()) {
      params.incident_id = this.incidentIdFilter.trim();
    }
    if (this.repositoryFilter.trim()) {
      params.repository = this.repositoryFilter.trim();
    }
    if (this.statusFilter) {
      params.status_filter = this.statusFilter;
    }

    this.prManagementService.listPRs(params).subscribe({
      next: (response) => {
        this.prs = response.prs;
        this.total = response.total;
        this.totalPages = Math.ceil(this.total / this.limit);
        this.currentPage = Math.floor(this.skip / this.limit) + 1;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading PRs:', error);
        this.errorMessage = error.error?.message || error.error?.detail || 'Failed to load pull requests. Please try again.';
        this.prs = [];
        this.total = 0;
        this.totalPages = 0;
        this.isLoading = false;
      }
    });
  }

  /**
   * Handle filter changes
   */
  onFilterChange(): void {
    // Reset to first page when filters change
    this.skip = 0;
    this.currentPage = 1;
    this.loadPRs();
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.onFilterChange();
  }

  /**
   * Go to next page
   */
  onNextPage(): void {
    if (this.skip + this.limit < this.total) {
      this.skip += this.limit;
      this.loadPRs();
    }
  }

  /**
   * Go to previous page
   */
  onPreviousPage(): void {
    if (this.skip > 0) {
      this.skip = Math.max(0, this.skip - this.limit);
      this.loadPRs();
    }
  }

  /**
   * Emit view details event
   */
  onViewDetails(prId: string): void {
    this.viewDetails.emit(prId);
  }

  /**
   * Get badge color based on PR status
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format confidence score as percentage
   */
  formatConfidence(score: number): string {
    return `${(score * 100).toFixed(0)}%`;
  }

  /**
   * Check if there's a previous page
   */
  get hasPreviousPage(): boolean {
    return this.skip > 0;
  }

  /**
   * Check if there's a next page
   */
  get hasNextPage(): boolean {
    return this.skip + this.limit < this.total;
  }

  /**
   * Get Math object for template
   */
  get Math() {
    return Math;
  }
}
