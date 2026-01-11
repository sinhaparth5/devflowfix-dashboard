import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SeoService } from '../../../../shared/services/seo.service';
import { IncidentsService, IncidentStatsResponse } from '../../../../shared/services/incidents.service';
import { ApexOptions } from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-incidents-stats',
  standalone: true,
  imports: [RouterModule, NgApexchartsModule],
  templateUrl: './incidents-stats.component.html',
  styles: []
})
export class IncidentsStatsComponent implements OnInit {
  stats: IncidentStatsResponse | null = null;
  isLoading = false;
  error: string | null = null;

  // Chart options
  sourceChartOptions: Partial<ApexOptions> = {};
  severityChartOptions: Partial<ApexOptions> = {};
  failureTypeChartOptions: Partial<ApexOptions> = {};
  outcomeChartOptions: Partial<ApexOptions> = {};

  constructor(
    private seoService: SeoService,
    private incidentsService: IncidentsService
  ) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Incident Statistics | DevFlowFix',
      description: 'View comprehensive statistics and insights about your incidents',
      keywords: 'incident statistics, analytics, devflowfix',
      url: '/dashboard/incidents/stats',
      type: 'website'
    });

    this.seoService.addBreadcrumb([
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Incidents', url: '/dashboard/incidents' },
      { name: 'Statistics', url: '/dashboard/incidents/stats' }
    ]);

    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.error = null;

    this.incidentsService.getIncidentStats().subscribe({
      next: (data: IncidentStatsResponse) => {
        this.stats = data;
        this.setupCharts(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading incident statistics:', err);
        this.error = 'Failed to load statistics. Please try again.';
        this.isLoading = false;
      }
    });
  }

  setupCharts(data: IncidentStatsResponse): void {
    if (data.by_source) this.setupSourceChart(data.by_source);
    if (data.by_severity) this.setupSeverityChart(data.by_severity);
    if (data.by_failure_type) this.setupFailureTypeChart(data.by_failure_type);
    this.setupOutcomeChart();
  }

  setupSourceChart(data: { [key: string]: number }): void {
    if (!data || Object.keys(data).length === 0) {
      this.sourceChartOptions = {}; // Clear chart options if no data
      return;
    }

    // Filter out invalid values and convert to arrays
    const entries = Object.entries(data).filter(([_, value]) => value != null && !isNaN(value) && value > 0);
    if (entries.length === 0) {
      this.sourceChartOptions = {};
      return;
    }

    const labels = entries.map(([key]) => key);
    const values = entries.map(([_, value]) => value);

    this.sourceChartOptions = {
      series: values,
      chart: {
        type: 'donut',
        height: 350
      },
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  setupSeverityChart(data: { [key: string]: number }): void {
    if (!data || Object.keys(data).length === 0) {
      this.severityChartOptions = {}; // Clear chart options if no data
      return;
    }

    // Filter out invalid values and convert to arrays
    const entries = Object.entries(data).filter(([_, value]) => value != null && !isNaN(value));
    if (entries.length === 0) {
      this.severityChartOptions = {};
      return;
    }

    const labels = entries.map(([key]) => key);
    const values = entries.map(([_, value]) => value);

    this.severityChartOptions = {
      series: [{
        name: 'Incidents',
        data: values
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1))
      },
      colors: ['#EF4444', '#F59E0B', '#FBBF24', '#3B82F6'],
      fill: {
        opacity: 1
      }
    };
  }

  setupFailureTypeChart(data: { [key: string]: number }): void {
    if (!data || Object.keys(data).length === 0) {
      this.failureTypeChartOptions = {}; // Clear chart options if no data
      return;
    }

    // Filter out invalid values, sort, and take top 10
    const sorted = Object.entries(data)
      .filter(([_, value]) => value != null && !isNaN(value) && value > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    if (sorted.length === 0) {
      this.failureTypeChartOptions = {};
      return;
    }

    const labels = sorted.map(([key]) => key);
    const values = sorted.map(([, value]) => value);

    this.failureTypeChartOptions = {
      series: [{
        name: 'Incidents',
        data: values
      }],
      chart: {
        type: 'bar',
        height: 400
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: labels
      },
      colors: ['#3B82F6'],
      fill: {
        opacity: 1
      }
    };
  }

  setupOutcomeChart(): void {
    if (!this.stats) {
      this.outcomeChartOptions = {}; // Clear chart options if no data
      return;
    }

    const data = [
      { name: 'Resolved', value: this.stats.resolved_count || 0 },
      { name: 'Pending', value: this.stats.pending_count || 0 },
      { name: 'Failed', value: this.stats.failed_count || 0 },
      { name: 'Escalated', value: this.stats.escalated_count || 0 },
      { name: 'Rolled Back', value: this.stats.rolled_back_count || 0 }
    ];

    // Check if we have any data
    const totalCount = data.reduce((sum, d) => sum + d.value, 0);
    if (totalCount === 0) {
      this.outcomeChartOptions = {};
      return;
    }

    this.outcomeChartOptions = {
      series: data.map(d => d.value),
      chart: {
        type: 'pie',
        height: 350
      },
      labels: data.map(d => d.name),
      colors: ['#10B981', '#FBBF24', '#EF4444', '#8B5CF6', '#F59E0B'],
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  formatTime(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  getSuccessRateColor(rate: number): string {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }
}
