# PR Management API Documentation

## GitHub Token Management

### 1. Register GitHub Token
**Route:** `POST /api/v1/pr-management/tokens/register`

**What it does:** Registers a GitHub Personal Access Token for automated PR creation on specific repositories or organizations.

**Request:**
```
Query Parameters:
- owner: string (required) - GitHub organization/user
- repo: string (optional) - Repository name (null for org-level)
- token: string (required) - GitHub Personal Access Token
- description: string (optional) - Token description
- scopes: string (optional) - Comma-separated scopes

Headers:
- Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Token registered for owner/repo",
  "token": {
    "token_id": "token_xxx",
    "owner": "owner",
    "repo": "repo",
    "scopes": ["repo", "workflow", "contents"],
    "created_at": "2025-12-16T10:30:00Z"
  }
}
```

---

### 2. List GitHub Tokens
**Route:** `GET /api/v1/pr-management/tokens`

**What it does:** Lists all registered GitHub tokens for the current user (tokens are masked for security).

**Request:**
```
Query Parameters:
- owner: string (optional) - Filter by owner
- active_only: boolean (default: true) - Only list active tokens

Headers:
- Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "tokens": [
    {
      "token_id": "token_xxx",
      "owner": "owner",
      "repo": "repo",
      "token_masked": "ghp_****...****",
      "scopes": ["repo", "workflow"],
      "is_active": true,
      "created_at": "2025-12-16T10:30:00Z"
    }
  ]
}
```

---

### 3. Deactivate GitHub Token
**Route:** `POST /api/v1/pr-management/tokens/{token_id}/deactivate`

**What it does:** Deactivates a GitHub token (soft delete - marks as inactive but doesn't delete from database).

**Request:**
```
Path Parameters:
- token_id: string (required) - Token ID to deactivate

Headers:
- Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Token token_xxx deactivated"
}
```

---

## PR Tracking

### 4. List Pull Requests
**Route:** `GET /api/v1/pr-management/pulls`

**What it does:** Lists pull requests created by DevFlowFix with optional filtering and pagination.

**Request:**
```
Query Parameters:
- incident_id: string (optional) - Filter by incident ID
- repository: string (optional) - Filter by repository (owner/repo)
- status_filter: string (optional) - Filter by PR status
- skip: integer (default: 0) - Number of records to skip
- limit: integer (default: 20, max: 100) - Number of records to return
```

**Response:**
```json
{
  "success": true,
  "total": 45,
  "skip": 0,
  "limit": 20,
  "prs": [
    {
      "id": "pr_xxx",
      "incident_id": "inc_xxx",
      "pr_number": 123,
      "pr_url": "https://github.com/owner/repo/pull/123",
      "repository": "owner/repo",
      "title": "DevFlowFix: Build Failure",
      "branch": "devflowfix/auto-fix-build-failure-xxx",
      "status": "open",
      "failure_type": "build_failure",
      "confidence_score": 0.95,
      "files_changed": 3,
      "additions": 45,
      "deletions": 12,
      "created_at": "2025-12-16T10:30:00Z",
      "merged_at": null,
      "approved_by": null
    }
  ]
}
```

---

### 5. Get Pull Request Details
**Route:** `GET /api/v1/pr-management/pulls/{pr_id}`

**What it does:** Retrieves detailed information about a specific automated pull request.

**Request:**
```
Path Parameters:
- pr_id: string (required) - Pull request ID
```

**Response:**
```json
{
  "success": true,
  "pr": {
    "id": "pr_xxx",
    "incident_id": "inc_xxx",
    "pr_number": 123,
    "pr_url": "https://github.com/owner/repo/pull/123",
    "repository": "owner/repo",
    "title": "DevFlowFix: Build Failure",
    "description": "## Automated Fix by DevFlowFix...",
    "branch": "devflowfix/auto-fix-build-failure-xxx",
    "base_branch": "main",
    "status": "open",
    "failure_type": "build_failure",
    "root_cause": "Missing dependency in package.json",
    "confidence_score": 0.95,
    "files_changed": 3,
    "additions": 45,
    "deletions": 12,
    "commits_count": 1,
    "review_comments_count": 0,
    "approved_by": null,
    "has_conflicts": false,
    "created_at": "2025-12-16T10:30:00Z",
    "updated_at": "2025-12-16T10:30:00Z",
    "merged_at": null,
    "closed_at": null,
    "metadata": {}
  }
}
```

---

### 6. Update Pull Request Status
**Route:** `POST /api/v1/pr-management/pulls/{pr_id}/update-status`

**What it does:** Updates the status of an automated pull request (useful for syncing PR status from GitHub).

**Request:**
```
Path Parameters:
- pr_id: string (required) - Pull request ID

Query Parameters:
- new_status: string (required) - New status (created, open, draft, review_requested, approved, merged, closed, failed)

Body (optional):
{
  "metadata": {
    "key": "value"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "PR 123 status updated to merged",
  "pr_id": "pr_xxx",
  "status": "merged"
}
```

---

## Statistics

### 7. Get PR Statistics
**Route:** `GET /api/v1/pr-management/stats`

**What it does:** Retrieves statistics about automated PR creation including totals, merge rates, and code change metrics.

**Request:**
```
No parameters required
```

**Response:**
```json
{
  "success": true,
  "statistics": {
    "total_prs": 150,
    "merged_count": 120,
    "merge_rate": 80.0,
    "status_distribution": {
      "created": 5,
      "open": 15,
      "merged": 120,
      "closed": 10
    },
    "avg_files_per_pr": 2.5,
    "total_additions": 6750,
    "total_deletions": 2100
  }
}
```
