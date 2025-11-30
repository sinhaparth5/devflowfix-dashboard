import { Routes } from '@angular/router';
import { authGaurd } from './shared/components/auth/auth.gaurd';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./shared/layout/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authGaurd],
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./pages/dashboard/ecommerce/ecommerce.component').then(m => m.EcommerceComponent),
        pathMatch: 'full',
        title: 'Angular Ecommerce Dashboard | TailAdmin - Angular Admin Dashboard Template',
      },
      {
        path: 'calendar',
        loadComponent: () => 
          import('./pages/calender/calender.component').then(m => m.CalenderComponent),
        title: 'Angular Calendar | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'profile',
        loadComponent: () => 
          import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Angular Profile Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'form-elements',
        loadComponent: () => 
          import('./pages/forms/form-elements/form-elements.component').then(m => m.FormElementsComponent),
        title: 'Angular Form Elements Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'basic-tables',
        loadComponent: () => 
          import('./pages/tables/basic-tables/basic-tables.component').then(m => m.BasicTablesComponent),
        title: 'Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'blank',
        loadComponent: () => 
          import('./pages/blank/blank.component').then(m => m.BlankComponent),
        title: 'Angular Blank Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'invoice',
        loadComponent: () => 
          import('./pages/invoices/invoices.component').then(m => m.InvoicesComponent),
        title: 'Angular Invoice Details Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'line-chart',
        loadComponent: () => 
          import('./pages/charts/line-chart/line-chart.component').then(m => m.LineChartComponent),
        title: 'Angular Line Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'bar-chart',
        loadComponent: () => 
          import('./pages/charts/bar-chart/bar-chart.component').then(m => m.BarChartComponent),
        title: 'Angular Bar Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'alerts',
        loadComponent: () => 
          import('./pages/ui-elements/alerts/alerts.component').then(m => m.AlertsComponent),
        title: 'Angular Alerts Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'avatars',
        loadComponent: () => 
          import('./pages/ui-elements/avatar-element/avatar-element.component').then(m => m.AvatarElementComponent),
        title: 'Angular Avatars Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'badge',
        loadComponent: () => 
          import('./pages/ui-elements/badges/badges.component').then(m => m.BadgesComponent),
        title: 'Angular Badges Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'buttons',
        loadComponent: () => 
          import('./pages/ui-elements/buttons/buttons.component').then(m => m.ButtonsComponent),
        title: 'Angular Buttons Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'images',
        loadComponent: () => 
          import('./pages/ui-elements/images/images.component').then(m => m.ImagesComponent),
        title: 'Angular Images Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path: 'videos',
        loadComponent: () => 
          import('./pages/ui-elements/videos/videos.component').then(m => m.VideosComponent),
        title: 'Angular Videos Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
    ]
  },
  // Auth pages
  {
    path: 'signin',
    loadComponent: () => 
      import('./pages/auth-pages/sign-in/sign-in.component').then(m => m.SignInComponent),
    title: 'Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  {
    path: 'signup',
    loadComponent: () => 
      import('./pages/auth-pages/sign-up/sign-up.component').then(m => m.SignUpComponent),
    title: 'Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  // Error pages
  {
    path: '**',
    loadComponent: () => 
      import('./pages/other-page/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
];
