import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../../../shared/services/seo.service';
import { IncidentsService, Incident, IncidentFilters, IncidentsListResponse } from '../../../../shared/services/incidents.service';
import { IncidentStatusBadgeComponent } from '../../../../shared/components/incidents/incident-status-badge.component';
import { IncidentSeverityIconComponent } from '../../../../shared/components/incidents/incident-severity-icon.component';
import { IncidentFilterComponent } from '../../../../shared/components/incidents/incident-filter.component';

@Component({
  selector: 'app-admin-incidents',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    IncidentStatusBadgeComponent,
    IncidentSeverityIconComponent,
    IncidentFilterComponent
],
  templateUrl: './admin-incidents.component.html',
  styles: []
})
export class AdminIncidentsComponent implements OnInit {
  incidents: Incident[] = [];
  totalIncidents = 0;
  isLoading = false;
  error: string | null = null;

  filters: IncidentFilters = {
    skip: 0,
    limit: 20
  };

  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalPages = 1;

  // Expose Math to template
  Math = Math;

  // Assignment
  assignUserId: string = '';
  assigningIncidentId: string | null = null;

  constructor(
    private seoService: SeoService,
    private incidentsService: IncidentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Admin - All Incidents | DevFlowFix',
      description: 'Admin view of all incidents across all users',
      keywords: 'admin, incidents, monitoring, devflowfix',
      url: '/dashboard/admin/incidents',
      type: 'website'
    });

    this.seoService.addBreadcrumb([
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Admin', url: '/dashboard/admin/incidents' },
      { name: 'All Incidents', url: '/dashboard/admin/incidents' }
    ]);

    this.loadIncidents();
  }

  loadIncidents(): void {
    this.isLoading = true;
    this.error = null;

    this.incidentsService.adminListAllIncidents(this.filters).subscribe({
      next: (response: IncidentsListResponse) => {
        this.incidents = response.incidents;
        this.totalIncidents = response.total;
        this.totalPages = Math.ceil(this.totalIncidents / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading incidents:', err);
        this.error = 'Failed to load incidents. You may not have admin permissions.';
        this.isLoading = false;
      }
    });
  }

  onFiltersChange(newFilters: IncidentFilters): void {
    this.filters = { ...newFilters, skip: 0, limit: this.pageSize };
    this.currentPage = 1;
    this.loadIncidents();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.filters.skip = (page - 1) * this.pageSize;
    this.loadIncidents();
  }

  viewIncidentDetails(incidentId: string): void {
    this.router.navigate(['/dashboard/incidents', incidentId]);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get pageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  openAssignModal(incidentId: string): void {
    this.assigningIncidentId = incidentId;
    this.assignUserId = '';
  }

  closeAssignModal(): void {
    this.assigningIncidentId = null;
    this.assignUserId = '';
  }

  assignIncident(): void {
    if (!this.assigningIncidentId || !this.assignUserId) return;

    this.incidentsService.adminAssignIncident(this.assigningIncidentId, this.assignUserId).subscribe({
      next: () => {
        alert('Incident assigned successfully!');
        this.closeAssignModal();
        this.loadIncidents();
      },
      error: (err) => {
        console.error('Error assigning incident:', err);
        alert('Failed to assign incident. Please try again.');
      }
    });
  }
}
