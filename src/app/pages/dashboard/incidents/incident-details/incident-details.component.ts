import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeoService } from '../../../../shared/services/seo.service';
import { IncidentsService, IncidentDetail } from '../../../../shared/services/incidents.service';
import { IncidentStatusBadgeComponent } from '../../../../shared/components/incidents/incident-status-badge.component';
import { IncidentSeverityIconComponent } from '../../../../shared/components/incidents/incident-severity-icon.component';

@Component({
  selector: 'app-incident-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IncidentStatusBadgeComponent,
    IncidentSeverityIconComponent
  ],
  templateUrl: './incident-details.component.html',
  styles: []
})
export class IncidentDetailsComponent implements OnInit {
  incident: IncidentDetail | null = null;
  isLoading = false;
  error: string | null = null;
  incidentId: string = '';

  constructor(
    private seoService: SeoService,
    private incidentsService: IncidentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.incidentId = this.route.snapshot.params['id'];

    this.seoService.updateSEO({
      title: 'Incident Details | DevFlowFix',
      description: 'View detailed information about this incident',
      keywords: 'incident details, monitoring, devflowfix',
      url: `/dashboard/incidents/${this.incidentId}`,
      type: 'website'
    });

    this.seoService.addBreadcrumb([
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Incidents', url: '/dashboard/incidents' },
      { name: 'Details', url: `/dashboard/incidents/${this.incidentId}` }
    ]);

    this.loadIncidentDetails();
  }

  loadIncidentDetails(): void {
    this.isLoading = true;
    this.error = null;

    this.incidentsService.getIncident(this.incidentId).subscribe({
      next: (incident: IncidentDetail) => {
        this.incident = incident;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading incident details:', err);
        this.error = 'Failed to load incident details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getResolutionTime(): string {
    if (!this.incident || !this.incident.resolved_at) return 'N/A';

    const created = new Date(this.incident.created_at);
    const resolved = new Date(this.incident.resolved_at);
    const diff = resolved.getTime() - created.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/incidents']);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }
}
