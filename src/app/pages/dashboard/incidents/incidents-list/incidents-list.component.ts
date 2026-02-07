import { Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { SeoService } from '../../../../shared/services/seo.service';
import { IncidentsService, Incident, IncidentFilters, IncidentsListResponse } from '../../../../shared/services/incidents.service';
import { WasmService } from '../../../../shared/services/wasm.service';
import { IncidentStatusBadgeComponent } from '../../../../shared/components/incidents/incident-status-badge.component';
import { IncidentSeverityIconComponent } from '../../../../shared/components/incidents/incident-severity-icon.component';
import { IncidentFilterComponent } from '../../../../shared/components/incidents/incident-filter.component';

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [
    RouterModule,
    IncidentStatusBadgeComponent,
    IncidentSeverityIconComponent,
    IncidentFilterComponent
],
  templateUrl: './incidents-list.component.html',
  styles: []
})
export class IncidentsListComponent implements OnInit {
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

  constructor(
    private seoService: SeoService,
    private incidentsService: IncidentsService,
    private wasmService: WasmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Incidents | DevFlowFix - Monitor & Track Issues',
      description: 'View and manage all your incidents. Filter by source, severity, status and more.',
      keywords: 'incidents, monitoring, tracking, devflowfix, CI/CD issues',
      url: '/dashboard/incidents',
      type: 'website'
    });

    this.seoService.addBreadcrumb([
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Incidents', url: '/dashboard/incidents' }
    ]);

    this.loadIncidents();
  }

  loadIncidents(): void {
    this.isLoading = true;
    this.error = null;

    this.incidentsService.listIncidents(this.filters).subscribe({
      next: (response: IncidentsListResponse) => {
        this.incidents = response.incidents;
        this.totalIncidents = response.total;
        this.totalPages = Math.ceil(this.totalIncidents / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading incidents:', err);
        this.error = 'Failed to load incidents. Please try again.';
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

  getResolutionTime(createdAt: string, resolvedAt: string | null): string {
    if (!resolvedAt) return 'N/A';
    return this.wasmService.module.compute_resolution_time(createdAt, resolvedAt);
  }

  get pageNumbers(): number[] {
    const wasm = this.wasmService.module;
    const result = wasm.compute_page_numbers(this.currentPage, this.totalPages, 5);
    return Array.from(result);
  }

  exportToCSV(): void {
    const wasm = this.wasmService.module;
    const csv = wasm.build_incidents_csv(this.incidents);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `incidents_${new Date().toISOString()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
