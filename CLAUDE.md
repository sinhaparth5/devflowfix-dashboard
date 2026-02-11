# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevFlowFix Dashboard is an Angular 21+ application built with Tailwind CSS v4. It provides an admin dashboard for automated deployment failure resolution, featuring incident management, PR management, webhooks, and analytics.

## Common Commands

```bash
# Development
npm start              # Start dev server at http://localhost:4200
npm run build          # Production build (outputs to dist/devflowfix)
npm test               # Run Karma tests
npm run watch          # Development build with watch mode

# Docker
docker build -t parthsinha90/devflowfix:v1.0 .
docker run -p 80:80 parthsinha90/devflowfix:v1.0

# Kubernetes/Helm deployment
helm upgrade --install devflowfix ./devflowfix-chart -n devflowfix --create-namespace
kubectl get pods -n devflowfix -w
```

## Architecture

### Frontend Structure

- **Standalone components**: All components use Angular's standalone architecture with lazy loading
- **Authentication**: Zitadel OAuth2/OIDC via `angular-oauth2-oidc` library
  - Auth config in `src/app/auth/auth.config.ts`
  - Guards: `authGuard` (requires login), `noAuthGuard` (redirects logged-in users)
  - Token interceptor in `src/app/auth/auth.interceptor.ts`

### Route Organization

Routes are defined in `src/app/app.routes.ts`:

- **Public pages**: `/`, `/about`, `/product`, `/pricing`, `/contact`, `/blog`
- **Legal pages**: `/privacy-policy`, `/terms-of-service`, `/cookie-policy`
- **Dashboard (protected)**: `/dashboard/*` - requires authentication
  - Core: `/dashboard` (analytics), `/dashboard/incidents`, `/dashboard/pr-management`, `/dashboard/webhooks`
  - Admin: `/dashboard/admin/incidents`, `/dashboard/admin/stats`
- **Auth pages**: `/signin`, `/signup` (redirect to dashboard if already logged in)

### Layout System

- `AppLayoutComponent` (`src/app/shared/layout/app-layout/`) - main dashboard wrapper with sidebar
- `AuthPageLayoutComponent` - authentication pages layout
- Sidebar navigation in `src/app/shared/layout/app-sidebar/`

### Key Dependencies

- **Charts**: ApexCharts via `ng-apexcharts`
- **Calendar**: FullCalendar
- **Maps**: amCharts 5
- **Styling**: Tailwind CSS v4 with PostCSS

## Deployment Infrastructure

The app deploys to Azure Kubernetes Service (AKS):

```
Internet -> Cloudflare (DNS/CDN) -> Azure Load Balancer -> kgateway (Gateway API) -> DevFlowFix Pods
```

- **Ingress**: kgateway (Kubernetes Gateway API) with Gateway + HTTPRoute resources
- **TLS**: cert-manager with Let's Encrypt
- **Helm chart**: `devflowfix-chart/` directory
- **K8s manifests**: `k8s/` directory (deployment, service, gateway, httproute, HPA, PDB, network policies)

Detailed CLI commands for Kubernetes, Helm, and Docker operations are in `CLI.md`.

## Build Output

Production builds output to `dist/devflowfix/browser/` and are served via Nginx in the Docker container.
