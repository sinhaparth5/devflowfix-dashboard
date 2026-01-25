import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeoService } from '../../../shared/services/seo.service';
import { AnalyticsService, IncidentStats, TrendDataPoint, BreakdownData, MTTRData, TopRepository } from '../../../shared/services/analytics.service';
import { ApexOptions } from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './analytics.component.html',
  styles: ``
})
export class AnalyticsComponent implements OnInit {

  // Data
  stats: IncidentStats | null = null;
  trends: TrendDataPoint[] = [];
  breakdownBySource: BreakdownData = {};
  breakdownBySeverity: BreakdownData = {};
  mttr: MTTRData | null = null;
  topRepositories: TopRepository[] = [];

  // Loading states
  isLoadingStats = false;
  isLoadingTrends = false;
  isLoadingBreakdown = false;
  isLoadingMTTR = false;
  isLoadingRepos = false;

  // Chart options
  trendsChartOptions: Partial<ApexOptions> = {};
  sourceChartOptions: Partial<ApexOptions> = {};
  severityChartOptions: Partial<ApexOptions> = {};

  constructor(
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Analytics | DevFlowFix - Incident Monitoring & Performance',
      description: 'Monitor incidents, track performance metrics, and gain insights with DevFlowFix analytics dashboard. View incident trends, MTTR, auto-fix rates, and more.',
      keywords: 'analytics, incident monitoring, performance metrics, MTTR, auto-fix rate, devflowfix, CI/CD analytics',
      url: '/dashboard/analytics',
      type: 'website'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Analytics', url: '/dashboard/analytics' }
    ]);

    this.loadAllData();
  }

  loadAllData(): void {
    this.loadStats();
    this.loadTrends();
    this.loadBreakdowns();
    this.loadMTTR();
    this.loadTopRepositories();
  }

  loadStats(): void {
    this.isLoadingStats = true;
    this.analyticsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoadingStats = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        // Set default values so UI doesn't break
        this.stats = {
          total_incidents: 0,
          resolved_incidents: 0,
          failed_incidents: 0,
          pending_incidents: 0,
          escalated_incidents: 0,
          rolled_back_incidents: 0,
          success_rate: 0,
          average_resolution_time_seconds: null
        };
        this.isLoadingStats = false;
      }
    });
  }

  loadTrends(): void {
    this.isLoadingTrends = true;
    this.analyticsService.getTrends(30, 'day').subscribe({
      next: (data) => {
        this.trends = data;
        this.setupTrendsChart(data);
        this.isLoadingTrends = false;
      },
      error: (error) => {
        console.error('Error loading trends:', error);
        // Set empty array so chart shows empty state
        this.trends = [];
        this.setupTrendsChart([]);
        this.isLoadingTrends = false;
      }
    });
  }

  loadBreakdowns(): void {
    this.isLoadingBreakdown = true;

    this.analyticsService.getBreakdownBySource().subscribe({
      next: (data) => {
        this.breakdownBySource = data;
        this.setupSourceChart(data);
      },
      error: (error) => {
        console.error('Error loading source breakdown:', error);
        this.breakdownBySource = {};
        this.setupSourceChart({});
      }
    });

    this.analyticsService.getBreakdownBySeverity().subscribe({
      next: (data) => {
        this.breakdownBySeverity = data;
        this.setupSeverityChart(data);
        this.isLoadingBreakdown = false;
      },
      error: (error) => {
        console.error('Error loading severity breakdown:', error);
        this.breakdownBySeverity = {};
        this.setupSeverityChart({});
        this.isLoadingBreakdown = false;
      }
    });
  }

  loadMTTR(): void {
    this.isLoadingMTTR = true;
    this.analyticsService.getMTTR().subscribe({
      next: (data) => {
        this.mttr = data;
        this.isLoadingMTTR = false;
      },
      error: (error) => {
        console.error('Error loading MTTR:', error);
        // Keep mttr as null so the UI can handle the empty state
        this.mttr = null;
        this.isLoadingMTTR = false;
      }
    });
  }

  loadTopRepositories(): void {
    this.isLoadingRepos = true;
    this.analyticsService.getTopRepositories(5).subscribe({
      next: (data) => {
        this.topRepositories = data;
        this.isLoadingRepos = false;
      },
      error: (error) => {
        console.error('Error loading top repositories:', error);
        // Set empty array so the UI can show "No data available" instead of loading spinner
        this.topRepositories = [];
        this.isLoadingRepos = false;
      }
    });
  }

  setupTrendsChart(data: TrendDataPoint[]): void {
    // Handle empty data to avoid ApexCharts errors
    if (!data || data.length === 0) {
      this.trendsChartOptions = {
        series: [
          { name: 'Total', data: [] },
          { name: 'Resolved', data: [] },
          { name: 'Failed', data: [] }
        ],
        chart: {
          type: 'area',
          height: 320,
          toolbar: { show: false },
          zoom: { enabled: false },
          fontFamily: 'inherit',
          sparkline: { enabled: false }
        },
        colors: ['#3B82F6', '#10B981', '#F43F5E'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0.05,
            stops: [0, 95, 100]
          }
        },
        xaxis: {
          categories: [],
          labels: {
            style: { colors: '#9CA3AF', fontSize: '12px' }
          },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: {
            style: { colors: '#9CA3AF', fontSize: '12px' }
          }
        },
        legend: { show: false },
        grid: {
          borderColor: '#E5E7EB',
          strokeDashArray: 4,
          xaxis: { lines: { show: false } }
        },
        tooltip: {
          theme: 'light',
          x: { show: true }
        },
        noData: {
          text: 'No data available',
          align: 'center',
          verticalAlign: 'middle',
          style: { color: '#9CA3AF', fontSize: '14px' }
        }
      };
      return;
    }

    const dates = data.map(d => new Date(d.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const total = data.map(d => d.total);
    const resolved = data.map(d => d.resolved);
    const failed = data.map(d => d.failed);

    this.trendsChartOptions = {
      series: [
        { name: 'Total', data: total },
        { name: 'Resolved', data: resolved },
        { name: 'Failed', data: failed }
      ],
      chart: {
        type: 'area',
        height: 320,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'inherit'
      },
      colors: ['#3B82F6', '#10B981', '#F43F5E'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [0, 95, 100]
        }
      },
      xaxis: {
        categories: dates,
        labels: {
          style: { colors: '#9CA3AF', fontSize: '12px' },
          rotate: -45,
          rotateAlways: false
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#9CA3AF', fontSize: '12px' }
        }
      },
      legend: { show: false },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } }
      },
      tooltip: {
        theme: 'light',
        x: { show: true }
      }
    };
  }

  setupSourceChart(data: BreakdownData): void {
    const labels = Object.keys(data);
    const values = Object.values(data);

    // Handle empty data
    if (labels.length === 0 || values.length === 0) {
      this.sourceChartOptions = {
        series: [],
        chart: {
          type: 'donut',
          height: 280,
          fontFamily: 'inherit'
        },
        labels: [],
        colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
        legend: {
          position: 'bottom',
          fontSize: '13px',
          labels: { colors: '#6B7280' },
          markers: { radius: 4 },
          itemMargin: { horizontal: 12, vertical: 4 }
        },
        dataLabels: {
          enabled: true,
          style: { fontSize: '12px', fontWeight: 600 },
          dropShadow: { enabled: false }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
              labels: {
                show: true,
                name: { fontSize: '14px', color: '#6B7280' },
                value: { fontSize: '24px', fontWeight: 700, color: '#111827' },
                total: {
                  show: true,
                  label: 'Total',
                  fontSize: '14px',
                  color: '#6B7280'
                }
              }
            }
          }
        },
        stroke: { width: 0 },
        noData: {
          text: 'No data available',
          align: 'center',
          verticalAlign: 'middle',
          style: { color: '#9CA3AF', fontSize: '14px' }
        }
      };
      return;
    }

    this.sourceChartOptions = {
      series: values,
      chart: {
        type: 'donut',
        height: 280,
        fontFamily: 'inherit'
      },
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
      legend: {
        position: 'bottom',
        fontSize: '13px',
        labels: { colors: '#6B7280' },
        markers: { radius: 4 },
        itemMargin: { horizontal: 12, vertical: 4 }
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: '12px', fontWeight: 600 },
        dropShadow: { enabled: false }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: { fontSize: '14px', color: '#6B7280' },
              value: { fontSize: '24px', fontWeight: 700, color: '#111827' },
              total: {
                show: true,
                label: 'Total',
                fontSize: '14px',
                color: '#6B7280'
              }
            }
          }
        }
      },
      stroke: { width: 0 }
    };
  }

  setupSeverityChart(data: BreakdownData): void {
    const labels = Object.keys(data);
    const values = Object.values(data);

    // Map severity levels to colors
    const severityColors: { [key: string]: string } = {
      critical: '#EF4444',
      high: '#F97316',
      medium: '#F59E0B',
      low: '#10B981',
      info: '#3B82F6'
    };

    // Handle empty data
    if (labels.length === 0 || values.length === 0) {
      this.severityChartOptions = {
        series: [{
          name: 'Incidents',
          data: []
        }],
        chart: {
          type: 'bar',
          height: 280,
          toolbar: { show: false },
          fontFamily: 'inherit'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
            borderRadius: 6,
            distributed: true
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: [],
          labels: {
            style: { colors: '#6B7280', fontSize: '12px' }
          },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: {
            style: { colors: '#9CA3AF', fontSize: '12px' }
          }
        },
        colors: ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6'],
        fill: { opacity: 1 },
        legend: { show: false },
        grid: {
          borderColor: '#E5E7EB',
          strokeDashArray: 4,
          xaxis: { lines: { show: false } }
        },
        tooltip: { theme: 'light' },
        noData: {
          text: 'No data available',
          align: 'center',
          verticalAlign: 'middle',
          style: { color: '#9CA3AF', fontSize: '14px' }
        }
      };
      return;
    }

    // Get colors based on severity labels
    const colors = labels.map(l => severityColors[l.toLowerCase()] || '#6B7280');

    this.severityChartOptions = {
      series: [{
        name: 'Incidents',
        data: values
      }],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        fontFamily: 'inherit'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 6,
          distributed: true
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
        labels: {
          style: { colors: '#6B7280', fontSize: '12px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#9CA3AF', fontSize: '12px' }
        }
      },
      colors: colors,
      fill: { opacity: 1 },
      legend: { show: false },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } }
      },
      tooltip: { theme: 'light' }
    };
  }

  formatSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }

  formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }
}
