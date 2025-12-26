import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incident-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="getBadgeClasses()" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
      <span [ngClass]="getDotClasses()" class="w-2 h-2 rounded-full mr-1.5"></span>
      {{ getStatusLabel() }}
    </span>
  `,
  styles: []
})
export class IncidentStatusBadgeComponent {
  @Input() status: string = '';

  getBadgeClasses(): { [key: string]: boolean } {
    const normalized = this.status.toLowerCase();
    return {
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': normalized === 'resolved' || normalized === 'success',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': normalized === 'pending',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': normalized === 'failed',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400': normalized === 'escalated',
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400': normalized === 'rolled_back',
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400': normalized === 'timeout' || normalized === 'cancelled'
    };
  }

  getDotClasses(): { [key: string]: boolean } {
    const normalized = this.status.toLowerCase();
    return {
      'bg-green-500': normalized === 'resolved' || normalized === 'success',
      'bg-yellow-500': normalized === 'pending',
      'bg-red-500': normalized === 'failed',
      'bg-purple-500': normalized === 'escalated',
      'bg-orange-500': normalized === 'rolled_back',
      'bg-gray-500': normalized === 'timeout' || normalized === 'cancelled'
    };
  }

  getStatusLabel(): string {
    const labels: { [key: string]: string } = {
      'resolved': 'Resolved',
      'success': 'Success',
      'pending': 'Pending',
      'failed': 'Failed',
      'escalated': 'Escalated',
      'rolled_back': 'Rolled Back',
      'timeout': 'Timeout',
      'cancelled': 'Cancelled'
    };
    return labels[this.status.toLowerCase()] || this.status;
  }
}
