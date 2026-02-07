import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../shared/services/seo.service';
import { AnalyticsService, IncidentStats, TrendDataPoint, BreakdownData, MTTRData, TopRepository } from '../../../shared/services/analytics.service';
import { WasmService } from '../../../shared/services/wasm.service';
import { ApexOptions } from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-analytics',
  imports: [NgApexchartsModule],
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
    private analyticsService: AnalyticsService,
    private wasmService: WasmService
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
          { name: 'Total Incidents', data: [] },
          { name: 'Resolved', data: [] },
          { name: 'Failed', data: [] }
        ],
        chart: {
          type: 'line',
          height: 350,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: ['#3B82F6', '#10B981', '#EF4444'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: [] },
        yaxis: { title: { text: 'Count' } },
        legend: { position: 'top' },
        grid: { borderColor: '#f1f1f1' },
        noData: {
          text: 'No data available',
          align: 'center',
          verticalAlign: 'middle'
        }
      };
      return;
    }

    const wasm = this.wasmService.module;
    const transformed = wasm.transform_trends(data) as { dates: string[]; total: number[]; resolved: number[]; failed: number[] };

    this.trendsChartOptions = {
      series: [
        { name: 'Total Incidents', data: transformed.total },
        { name: 'Resolved', data: transformed.resolved },
        { name: 'Failed', data: transformed.failed }
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: ['#3B82F6', '#10B981', '#EF4444'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { categories: transformed.dates },
      yaxis: { title: { text: 'Count' } },
      legend: { position: 'top' },
      grid: { borderColor: '#f1f1f1' }
    };
  }

  setupSourceChart(data: BreakdownData): void {
    const keys = Object.keys(data);

    // Handle empty data
    if (keys.length === 0) {
      this.sourceChartOptions = {
        series: [],
        chart: {
          type: 'donut',
          height: 300
        },
        labels: [],
        colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
        legend: { position: 'bottom' },
        dataLabels: { enabled: true },
        noData: {
          text: 'No data available',
          align: 'center',
          verticalAlign: 'middle'
        }
      };
      return;
    }

    const wasm = this.wasmService.module;
    const transformed = wasm.transform_breakdown(data) as { labels: string[]; values: number[] };

    this.sourceChartOptions = {
      series: transformed.values,
      chart: {
        type: 'donut',
        height: 300
      },
      labels: transformed.labels,
      colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
      legend: { position: 'bottom' },
      dataLabels: { enabled: true }
    };
  }

  setupSeverityChart(data: BreakdownData): void {
    const keys = Object.keys(data);

    // Handle empty data
    if (keys.length === 0) {
      this.severityChartOptions = {
        series: [{
          name: 'Incidents',
          data: []
        }],
        chart: {
          type: 'bar',
          height: 300,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 4
          }
        },
        dataLabels: { enabled: false },
        xaxis: { categories: [] },
        yaxis: { title: { text: 'Count' } },
        colors: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
        fill: { opacity: 1 },
        noData: {
          text: 'No data available',
          align: 'center',
          verticalAlign: 'middle'
        }
      };
      return;
    }

    const wasm = this.wasmService.module;
    const transformed = wasm.transform_breakdown(data) as { labels: string[]; values: number[] };

    this.severityChartOptions = {
      series: [{
        name: 'Incidents',
        data: transformed.values
      }],
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: transformed.labels
      },
      yaxis: { title: { text: 'Count' } },
      colors: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
      fill: { opacity: 1 }
    };
  }

  formatSeconds(seconds: number): string {
    return this.wasmService.module.format_seconds_to_duration(seconds);
  }

  formatPercentage(value: number): string {
    return this.wasmService.module.format_percentage(value);
  }
}
