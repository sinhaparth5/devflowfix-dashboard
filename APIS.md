# DevFlowFix Dashboard - API Documentation

This document outlines all the APIs implemented and used in the DevFlowFix Dashboard frontend application.

## Base Configuration

- **Base URL**: `https://devflowfix-new-production.up.railway.app/api/v1`
- **Authentication**: Bearer token-based (JWT) via Authorization header
- **HTTP Client**: Angular HttpClient
- **Security**: Auth interceptor for token management, XSS sanitization interceptor

---

## 1. Authentication APIs

**Service File**: `src/app/shared/components/auth/auth.service.ts`

### 1.1 User Registration
```
POST /auth/register
```
**Request Body**:
```json
{
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string"
}
```

### 1.2 User Login
```
POST /auth/login
```
**Request Body**:
```json
{
  "email": "string",
  "password": "string",
  "device_fingerprint": "string (auto-generated)",
  "mfa_code": "string (optional)",
  "remember_me": "boolean (optional)"
}
```
**Response**:
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "string",
  "expires_in": "number",
  "user": {
    "user_id": "string",
    "email": "string",
    "full_name": "string",
    "role": "string",
    "is_active": "boolean",
    "is_mfa_enabled": "boolean",
    "avatar_url": "string",
    "github_username": "string",
    "organization_id": "string",
    "team_id": "string",
    "preferences": "object"
  }
}
```

### 1.3 Logout
```
POST /auth/logout
```
**Request Body** (optional):
```json
{
  "all_sessions": "boolean"
}
```

### 1.4 Refresh Token
```
POST /auth/refresh
```
**Request Body**:
```json
{
  "refresh_token": "string"
}
```

### 1.5 Get Current User Profile
```
GET /auth/me
```
**Response**: User object

### 1.6 Upload User Avatar
```
POST /auth/me/avatar
```
**Request**: FormData with `avatar_file`

### 1.7 Update User Information
```
PATCH /auth/me
```
**Request Body**:
```json
{
  "full_name": "string (optional)",
  "github_username": "string (optional)",
  "organization_id": "string (optional)",
  "team_id": "string (optional)",
  "preferences": "object (optional)"
}
```

---

## 2. PR Management APIs

**Service File**: `src/app/shared/services/pr-management.service.ts`

### 2.1 Token Management

#### 2.1.1 Register GitHub Token
```
POST /pr-management/tokens/register?token=<github_token>
```
**Query Parameters**:
- `token` (required): GitHub token
- `owner` (optional): Repository owner
- `repo` (optional): Repository name
- `description` (optional): Token description
- `scopes` (optional): Token scopes

#### 2.1.2 List Registered Tokens
```
GET /pr-management/tokens?owner=<owner>&active_only=<true|false>
```
**Query Parameters**:
- `owner` (optional): Filter by repository owner
- `active_only` (default: true): Only show active tokens

#### 2.1.3 Deactivate Token
```
POST /pr-management/tokens/{token_id}/deactivate
```

### 2.2 Pull Request Tracking

#### 2.2.1 List Pull Requests
```
GET /pr-management/pulls
```
**Query Parameters**:
- `incident_id` (optional): Filter by incident ID
- `repository` (optional): Filter by repository
- `status_filter` (optional): Filter by status
- `skip` (default: 0): Pagination offset
- `limit` (default: 20, max: 100): Results per page

**Response**:
```json
{
  "items": [
    {
      "id": "string",
      "incident_id": "string",
      "pr_number": "number",
      "pr_url": "string",
      "repository": "string",
      "title": "string",
      "branch": "string",
      "status": "string",
      "failure_type": "string",
      "confidence_score": "number",
      "files_changed": "number",
      "additions": "number",
      "deletions": "number",
      "created_at": "string",
      "merged_at": "string",
      "approved_by": "string"
    }
  ],
  "total": "number",
  "skip": "number",
  "limit": "number"
}
```

#### 2.2.2 Get Pull Request Details
```
GET /pr-management/pulls/{pr_id}
```
**Response**: Extended PR object with description, base_branch, root_cause, commits_count, review_comments_count, has_conflicts, metadata

#### 2.2.3 Update Pull Request Status
```
POST /pr-management/pulls/{pr_id}/update-status
```
**Request Body**:
```json
{
  "new_status": "string (required)",
  "metadata": "object (optional)"
}
```

### 2.3 Statistics

#### 2.3.1 Get PR Statistics
```
GET /pr-management/stats
```
**Response**:
```json
{
  "total_prs": "number",
  "merged_count": "number",
  "merge_rate": "number",
  "status_distribution": "object",
  "avg_files_per_pr": "number",
  "total_additions": "number",
  "total_deletions": "number"
}
```

---

## 3. Analytics APIs

**Service File**: `src/app/shared/services/analytics.service.ts`

### 3.1 Incident Statistics
```
GET /analytics/stats?start_date=<date>&end_date=<date>&source=<source>
```
**Response**:
```json
{
  "total_incidents": "number",
  "resolved_incidents": "number",
  "failed_incidents": "number",
  "pending_incidents": "number",
  "escalated_incidents": "number",
  "rolled_back_incidents": "number",
  "success_rate": "number",
  "average_resolution_time_seconds": "number"
}
```

### 3.2 Breakdown Endpoints

#### 3.2.1 Breakdown by Source
```
GET /analytics/breakdown/source?start_date=<date>&end_date=<date>
```

#### 3.2.2 Breakdown by Severity
```
GET /analytics/breakdown/severity?start_date=<date>&end_date=<date>
```

#### 3.2.3 Breakdown by Failure Type
```
GET /analytics/breakdown/failure-type?start_date=<date>&end_date=<date>
```

#### 3.2.4 Breakdown by Outcome
```
GET /analytics/breakdown/outcome?start_date=<date>&end_date=<date>
```

### 3.3 Trend Analysis

#### 3.3.1 Incident Trends
```
GET /analytics/trends?days=<number>&granularity=<hour|day|week>
```
**Query Parameters**:
- `days` (default: 30): Number of days to analyze
- `granularity` (default: day): Time granularity

### 3.4 Performance Metrics

#### 3.4.1 Mean Time To Repair (MTTR)
```
GET /analytics/mttr?start_date=<date>&end_date=<date>&source=<source>
```
**Response**:
```json
{
  "average_seconds": "number",
  "min_seconds": "number",
  "max_seconds": "number",
  "median_seconds": "number",
  "p95_seconds": "number",
  "sample_size": "number"
}
```

#### 3.4.2 Auto-Fix Rate
```
GET /analytics/auto-fix-rate?start_date=<date>&end_date=<date>
```

#### 3.4.3 Confidence Score Distribution
```
GET /analytics/confidence-distribution?start_date=<date>&end_date=<date>
```

#### 3.4.4 Remediation Success
```
GET /analytics/remediation-success?start_date=<date>&end_date=<date>
```

### 3.5 User Feedback
```
GET /analytics/feedback?start_date=<date>&end_date=<date>
```

### 3.6 Top Lists

#### 3.6.1 Top Failure Types
```
GET /analytics/top/failure-types?limit=<number>&start_date=<date>&end_date=<date>
```

#### 3.6.2 Top Repositories
```
GET /analytics/top/repositories?limit=<number>&start_date=<date>&end_date=<date>
```

### 3.7 Time Distribution

#### 3.7.1 Hourly Distribution
```
GET /analytics/distribution/hourly?days=<number>
```

#### 3.7.2 Daily Distribution
```
GET /analytics/distribution/daily?days=<number>
```

### 3.8 Overview & Dashboard

#### 3.8.1 Comprehensive Overview
```
GET /analytics/overview?days=<number>
```
**Response**: Complex object with period, summary, breakdowns, trends, performance metrics, top failure types, and hourly distribution

#### 3.8.2 Dashboard Summary
```
GET /analytics/dashboard
```

---

## 4. Webhook APIs

**Service File**: `src/app/shared/services/webhook.service.ts`

### 4.1 Generate Webhook Secret
```
POST /webhook/secret/generate/me
```
**Response**:
```json
{
  "user_id": "string",
  "email": "string",
  "webhook_secret": "string",
  "webhook_url": "string",
  "secret_length": "number",
  "algorithm": "string",
  "created_at": "string",
  "github_configuration": {
    "payload_url": "string",
    "content_type": "string",
    "secret": "string",
    "ssl_verification": "boolean",
    "events": "array",
    "active": "boolean"
  },
  "setup_instructions": "array",
  "test_configuration": "object"
}
```

### 4.2 Get Webhook Configuration Info
```
GET /webhook/secret/info/me
```
**Response**:
```json
{
  "user_id": "string",
  "email": "string",
  "webhook_configuration": {
    "secret_configured": "boolean",
    "secret_preview": "string",
    "secret_length": "number",
    "webhook_url": "string",
    "last_updated": "string"
  },
  "github_settings": "object",
  "status": {
    "ready": "boolean",
    "message": "string"
  },
  "actions": "array"
}
```

---

## 5. User Details APIs

**Service File**: `src/app/shared/services/user-details.service.ts`

### 5.1 Get User Details
```
GET /user-details/me
```
**Response**:
```json
{
  "country": "string",
  "city": "string",
  "postal_code": "string",
  "facebook_link": "string",
  "twitter_link": "string",
  "linkedin_link": "string",
  "instagram_link": "string",
  "github_link": "string",
  "user_id": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### 5.2 Update User Details
```
PUT /user-details/me
```
**Request Body**:
```json
{
  "country": "string (optional)",
  "city": "string (optional)",
  "postal_code": "string (optional)",
  "facebook_link": "string (optional)",
  "twitter_link": "string (optional)",
  "linkedin_link": "string (optional)",
  "instagram_link": "string (optional)",
  "github_link": "string (optional)"
}
```

---

## Security Features

### Authentication & Authorization
- JWT Bearer token authentication for all API calls
- Token refresh mechanism with automatic retry on 401 errors
- Cookie-based token storage with HttpOnly, Secure, and SameSite=Strict flags
- Device fingerprinting for login tracking
- Auth interceptor for automatic token attachment and refresh

### Security Configuration
**Service File**: `src/app/shared/services/security-config.service.ts`

- Content Security Policy (CSP) enabled
- Strict sanitization mode for XSS protection
- Input validation: Maximum 10,000 characters
- Allowed file types: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB

---

## Components Using APIs

### 1. Analytics Dashboard
- Location: `/pages/dashboard/analytics/`
- Uses: Analytics Service (all endpoints)

### 2. PR Management
- Location: `/pages/dashboard/pr-management/`
- Components:
  - PR list table
  - PR details modal
  - PR statistics dashboard
  - Token registration form
  - Token list table
- Uses: PR Management Service (all endpoints)

### 3. Webhooks Configuration
- Location: `/pages/dashboard/webhooks/`
- Uses: Webhook Service

### 4. User Profile
- Location: `/pages/profile/`
- Components:
  - User address card
  - User meta card
- Uses: User Details Service, Auth Service

### 5. Authentication Pages
- Location: `/pages/auth-pages/`
- Pages:
  - Sign-in
  - Sign-up
- Uses: Auth Service

### 6. Home Page
- Location: `/pages/home/`
- Uses: Various services for dashboard widgets

---

## Summary

- **Total API Services**: 5
- **Total Endpoints**: 43+
- **Base URL**: Single production Railway endpoint
- **Authentication**: JWT Bearer tokens with auto-refresh
- **Primary Features**:
  - Authentication & User Management
  - PR Management (GitHub Integration)
  - Analytics & Reporting
  - Webhook Configuration
  - User Profile Management

All API calls include proper error handling and use Angular's HttpClient with typed responses for type safety.
