import { Component, OnInit } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { MonthlySalesChartComponent } from '../../../shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { MonthlyTargetComponent } from '../../../shared/components/ecommerce/monthly-target/monthly-target.component';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { DemographicCardComponent } from '../../../shared/components/ecommerce/demographic-card/demographic-card.component';
import { RecentOrdersComponent } from '../../../shared/components/ecommerce/recent-orders/recent-orders.component';
import { SeoService } from '../../../shared/services/seo.service';

@Component({
  selector: 'app-ecommerce',
  imports: [
    EcommerceMetricsComponent,
    MonthlySalesChartComponent,
    MonthlyTargetComponent,
    StatisticsChartComponent,
    DemographicCardComponent,
    RecentOrdersComponent,
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Dashboard | DevFlowFix - Real-time Analytics & Insights',
      description: 'Monitor your projects, track performance metrics, and gain valuable insights with DevFlowFix dashboard. View sales, orders, revenue, and team productivity in real-time.',
      keywords: 'dashboard, analytics, metrics, sales tracking, performance monitoring, business intelligence, devflowfix',
      url: '/dashboard',
      type: 'website'
    });

    // Add breadcrumb
    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Dashboard', url: '/dashboard' }
    ]);
  }
}
