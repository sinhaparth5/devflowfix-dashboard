import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'DevFlowFix - Modern Project Management Dashboard',
      description: 'Transform your workflow with DevFlowFix. A powerful, modern dashboard built for teams who want to streamline their project management and boost productivity.',
      keywords: 'devflowfix, project management, dashboard, team collaboration, workflow automation, productivity tools',
      url: '/',
      type: 'website'
    });

    // Add breadcrumb for home page
    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' }
    ]);
  }
}
