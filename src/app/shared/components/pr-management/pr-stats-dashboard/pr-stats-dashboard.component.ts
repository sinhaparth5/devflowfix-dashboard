import { Component, OnInit } from '@angular/core';

import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'ng-apexcharts';
import { PrManagementService, PRStatistics } from '../../../services/pr-management.service';

@Component({
  selector: 'app-pr-stats-dashboard',
  standalone: true,
  imports: [
    NgApexchartsModule
],
  templateUrl: './pr-stats-dashboard.component.html'
})
export class PRStatsDashboardComponent implements OnInit {
  statistics: PRStatistics | null = null;
  isLoading = false;
  errorMessage = '';

  // Chart options
  statusDistributionChartOptions: any = {};

  constructor(private prManagementService: PrManagementService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  /**
   * Load statistics from API
   */
  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.prManagementService.getStatistics().subscribe({
      next: (response) => {
        this.statistics = response.statistics;
        this.setupCharts(this.statistics);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.errorMessage = error.error?.message || error.error?.detail || 'Failed to load statistics. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Setup charts with statistics data
   */
  setupCharts(stats: PRStatistics): void {
    // Status Distribution Donut Chart
    const labels = Object.keys(stats.status_distribution).map(
      key => key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
    );
    const values = Object.values(stats.status_distribution);

    this.statusDistributionChartOptions = {
      series: values,
      chart: {
        type: 'donut',
        height: 350,
        fontFamily: 'Satoshi, sans-serif'
      },
      labels: labels,
      colors: ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'],
      legend: {
        position: 'bottom',
        fontSize: '14px',
        fontWeight: 500
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val.toFixed(1) + '%';
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total PRs',
                fontSize: '16px',
                fontWeight: 600,
                formatter: () => {
                  return stats.total_prs.toString();
                }
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  /**
   * Refresh statistics
   */
  refresh(): void {
    this.loadStatistics();
  }

  /**
   * Get Object for template
   */
  get Object() {
    return Object;
  }

  /**
   * Format status name
   */
  formatStatusName(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }
}
