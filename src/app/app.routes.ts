import { Routes } from '@angular/router';
import { authGaurd } from './shared/components/auth/auth.gaurd';
import { guestGuard } from './shared/components/auth/guest.guard';

export const routes: Routes = [
  // Public home page
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    pathMatch: 'full',
    title: 'DevFlowFix - Automated Deployment Failure Resolution'
  },
  // Public pages
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/public/about/about.component').then(m => m.AboutComponent),
    title: 'About Us | DevFlowFix'
  },
  {
    path: 'product',
    loadComponent: () =>
      import('./pages/public/product/product.component').then(m => m.ProductComponent),
    title: 'Product Features | DevFlowFix'
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./pages/public/pricing/pricing.component').then(m => m.PricingComponent),
    title: 'Pricing | DevFlowFix'
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/public/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact Us | DevFlowFix'
  },
  {
    path: 'help-center',
    loadComponent: () =>
      import('./pages/public/help-center/help-center.component').then(m => m.HelpCenterComponent),
    title: 'Help Center | DevFlowFix'
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/public/blog/blog.component').then(m => m.BlogComponent),
    title: 'Blog | DevFlowFix'
  },
  // Protected dashboard routes
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./shared/layout/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authGaurd],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/analytics/analytics.component').then(m => m.AnalyticsComponent),
        pathMatch: 'full',
        title: 'Analytics | DevFlowFix',
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/calender/calender.component').then(m => m.CalenderComponent),
        title: 'Calendar | DevFlowFix Dashboard'
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Profile | DevFlowFix Dashboard'
      },
      {
        path: 'form-elements',
        loadComponent: () =>
          import('./pages/forms/form-elements/form-elements.component').then(m => m.FormElementsComponent),
        title: 'Form Elements | DevFlowFix Dashboard'
      },
      {
        path: 'basic-tables',
        loadComponent: () =>
          import('./pages/tables/basic-tables/basic-tables.component').then(m => m.BasicTablesComponent),
        title: 'Basic Tables | DevFlowFix Dashboard'
      },
      {
        path: 'blank',
        loadComponent: () =>
          import('./pages/blank/blank.component').then(m => m.BlankComponent),
        title: 'Blank Page | DevFlowFix Dashboard'
      },
      {
        path: 'webhooks',
        loadComponent: () =>
          import('./pages/dashboard/webhooks/webhooks.component').then(m => m.WebhooksComponent),
        title: 'Webhooks | DevFlowFix Dashboard'
      },
      {
        path: 'pr-management',
        loadComponent: () =>
          import('./pages/dashboard/pr-management/pr-management.component').then(m => m.PrManagementComponent),
        title: 'PR Management | DevFlowFix Dashboard'
      },
      {
        path: 'incidents',
        loadComponent: () =>
          import('./pages/dashboard/incidents/incidents-list/incidents-list.component').then(m => m.IncidentsListComponent),
        title: 'Incidents | DevFlowFix Dashboard'
      },
      {
        path: 'incidents/stats',
        loadComponent: () =>
          import('./pages/dashboard/incidents/incidents-stats/incidents-stats.component').then(m => m.IncidentsStatsComponent),
        title: 'Incident Statistics | DevFlowFix Dashboard'
      },
      {
        path: 'incidents/:id',
        loadComponent: () =>
          import('./pages/dashboard/incidents/incident-details/incident-details.component').then(m => m.IncidentDetailsComponent),
        title: 'Incident Details | DevFlowFix Dashboard'
      },
      {
        path: 'admin/incidents',
        loadComponent: () =>
          import('./pages/dashboard/admin/admin-incidents/admin-incidents.component').then(m => m.AdminIncidentsComponent),
        title: 'Admin - All Incidents | DevFlowFix Dashboard'
      },
      {
        path: 'admin/stats',
        loadComponent: () =>
          import('./pages/dashboard/admin/admin-stats/admin-stats.component').then(m => m.AdminStatsComponent),
        title: 'Admin - Global Stats | DevFlowFix Dashboard'
      },
      {
        path: 'invoice',
        loadComponent: () =>
          import('./pages/invoices/invoices.component').then(m => m.InvoicesComponent),
        title: 'Invoice Details | DevFlowFix Dashboard'
      },
      {
        path: 'line-chart',
        loadComponent: () =>
          import('./pages/charts/line-chart/line-chart.component').then(m => m.LineChartComponent),
        title: 'Line Chart | DevFlowFix Dashboard'
      },
      {
        path: 'bar-chart',
        loadComponent: () =>
          import('./pages/charts/bar-chart/bar-chart.component').then(m => m.BarChartComponent),
        title: 'Bar Chart | DevFlowFix Dashboard'
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./pages/ui-elements/alerts/alerts.component').then(m => m.AlertsComponent),
        title: 'Alerts | DevFlowFix Dashboard'
      },
      {
        path: 'avatars',
        loadComponent: () =>
          import('./pages/ui-elements/avatar-element/avatar-element.component').then(m => m.AvatarElementComponent),
        title: 'Avatars | DevFlowFix Dashboard'
      },
      {
        path: 'badge',
        loadComponent: () =>
          import('./pages/ui-elements/badges/badges.component').then(m => m.BadgesComponent),
        title: 'Badges | DevFlowFix Dashboard'
      },
      {
        path: 'buttons',
        loadComponent: () =>
          import('./pages/ui-elements/buttons/buttons.component').then(m => m.ButtonsComponent),
        title: 'Buttons | DevFlowFix Dashboard'
      },
      {
        path: 'images',
        loadComponent: () =>
          import('./pages/ui-elements/images/images.component').then(m => m.ImagesComponent),
        title: 'Images | DevFlowFix Dashboard'
      },
      {
        path: 'videos',
        loadComponent: () =>
          import('./pages/ui-elements/videos/videos.component').then(m => m.VideosComponent),
        title: 'Videos | DevFlowFix Dashboard'
      },
    ]
  },
  // Auth pages (protected by guest guard - redirects logged-in users to dashboard)
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/auth-pages/sign-in/sign-in.component').then(m => m.SignInComponent),
    canActivate: [guestGuard],
    title: 'Sign In | DevFlowFix'
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/auth-pages/sign-up/sign-up.component').then(m => m.SignUpComponent),
    canActivate: [guestGuard],
    title: 'Sign Up | DevFlowFix'
  },
  // Error pages
  {
    path: '**',
    loadComponent: () =>
      import('./pages/other-page/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found | DevFlowFix'
  },
];
