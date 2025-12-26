import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';

@Component({
  selector: 'app-incident-severity-icon',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div [ngClass]="getContainerClasses()" [title]="severity">
      <span [innerHTML]="getIcon() | safeHtml"></span>
    </div>
  `,
  styles: []
})
export class IncidentSeverityIconComponent {
  @Input() severity: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  getContainerClasses(): { [key: string]: boolean } {
    const normalized = this.severity.toLowerCase();
    return {
      'inline-flex items-center justify-center': true,
      'w-4 h-4': this.size === 'sm',
      'w-5 h-5': this.size === 'md',
      'w-6 h-6': this.size === 'lg',
      'text-red-600 dark:text-red-400': normalized === 'critical',
      'text-orange-600 dark:text-orange-400': normalized === 'high',
      'text-yellow-600 dark:text-yellow-400': normalized === 'medium',
      'text-blue-600 dark:text-blue-400': normalized === 'low'
    };
  }

  getIcon(): string {
    const icons: { [key: string]: string } = {
      'critical': `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 7C12.5523 7 13 7.44772 13 8V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V8C11 7.44772 11.4477 7 12 7ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="currentColor"/>
      </svg>`,
      'high': `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2L2 20H22L12 2ZM12 9C12.5523 9 13 9.44772 13 10V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V10C11 9.44772 11.4477 9 12 9ZM12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18Z" fill="currentColor"/>
      </svg>`,
      'medium': `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V8Z" fill="currentColor"/>
      </svg>`,
      'low': `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z" fill="currentColor"/>
      </svg>`
    };
    return icons[this.severity.toLowerCase()] || icons['low'];
  }
}
