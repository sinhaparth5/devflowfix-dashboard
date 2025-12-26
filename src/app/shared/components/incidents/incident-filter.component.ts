import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentFilters } from '../../services/incidents.service';

@Component({
  selector: 'app-incident-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Source Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source
          </label>
          <select
            [(ngModel)]="filters.source"
            (change)="onFilterChange()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            <option value="">All Sources</option>
            <option value="github">GitHub</option>
            <option value="argocd">ArgoCD</option>
            <option value="kubernetes">Kubernetes</option>
            <option value="jenkins">Jenkins</option>
            <option value="gitlab">GitLab</option>
          </select>
        </div>

        <!-- Severity Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Severity
          </label>
          <select
            [(ngModel)]="filters.severity"
            (change)="onFilterChange()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <!-- Outcome Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            [(ngModel)]="filters.outcome"
            (change)="onFilterChange()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="escalated">Escalated</option>
            <option value="rolled_back">Rolled Back</option>
            <option value="timeout">Timeout</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            [(ngModel)]="filters.search"
            (input)="onSearchChange()"
            placeholder="Search error logs..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500">
        </div>
      </div>

      <!-- Date Range Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            [(ngModel)]="filters.start_date"
            (change)="onFilterChange()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            [(ngModel)]="filters.end_date"
            (change)="onFilterChange()"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
        </div>

        <div class="flex items-end">
          <button
            (click)="onClearFilters()"
            class="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class IncidentFilterComponent {
  @Input() filters: IncidentFilters = {};
  @Output() filtersChange = new EventEmitter<IncidentFilters>();

  private searchTimeout: any;

  onFilterChange(): void {
    this.filtersChange.emit(this.filters);
  }

  onSearchChange(): void {
    // Debounce search input
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filtersChange.emit(this.filters);
    }, 500);
  }

  onClearFilters(): void {
    this.filters = {
      skip: 0,
      limit: 20
    };
    this.filtersChange.emit(this.filters);
  }
}
