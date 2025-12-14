import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../../shared/services/seo.service';
import { WebhookService, WebhookGenerateResponse, WebhookInfoResponse } from '../../../shared/services/webhook.service';
import { TableComponent } from '../../../shared/components/ui/table/table.component';
import { TableHeaderComponent } from '../../../shared/components/ui/table/table-header.component';
import { TableBodyComponent } from '../../../shared/components/ui/table/table-body.component';
import { TableRowComponent } from '../../../shared/components/ui/table/table-row.component';
import { TableCellComponent } from '../../../shared/components/ui/table/table-cell.component';

@Component({
  selector: 'app-webhooks',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableCellComponent
  ],
  templateUrl: './webhooks.component.html',
  styles: ``
})
export class WebhooksComponent implements OnInit {
  isLoading = false;
  isGenerating = false;
  webhookInfo: WebhookInfoResponse | null = null;
  generatedSecret: WebhookGenerateResponse | null = null;
  showSecret = false;
  errorMessage = '';
  successMessage = '';
  copiedField: string | null = null;

  constructor(
    private seoService: SeoService,
    private webhookService: WebhookService
  ) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Webhooks | DevFlowFix Dashboard',
      description: 'Manage your webhook secrets and GitHub integration',
      keywords: 'webhooks, github, devflowfix, integration',
      url: '/dashboard/webhooks',
      type: 'website'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Webhooks', url: '/dashboard/webhooks' }
    ]);

    this.loadWebhookInfo();
  }

  loadWebhookInfo(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.webhookService.getWebhookInfo().subscribe({
      next: (response) => {
        this.webhookInfo = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading webhook info:', error);
        this.errorMessage = 'Failed to load webhook information. Please try again.';
        this.isLoading = false;
      }
    });
  }

  generateSecret(): void {
    this.isGenerating = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.generatedSecret = null;

    this.webhookService.generateWebhookSecret().subscribe({
      next: (response) => {
        this.generatedSecret = response;
        this.showSecret = true;
        this.successMessage = 'Webhook secret generated successfully!';
        this.isGenerating = false;

        // Reload webhook info to update the configuration
        this.loadWebhookInfo();
      },
      error: (error) => {
        console.error('Error generating webhook secret:', error);
        this.errorMessage = 'Failed to generate webhook secret. Please try again.';
        this.isGenerating = false;
      }
    });
  }

  copyToClipboard(text: string, field: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedField = field;
      setTimeout(() => {
        this.copiedField = null;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  dismissSecret(): void {
    this.showSecret = false;
    this.generatedSecret = null;
    this.successMessage = '';
  }

  getStatusBadgeClass(ready: boolean): string {
    return ready
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  }
}
