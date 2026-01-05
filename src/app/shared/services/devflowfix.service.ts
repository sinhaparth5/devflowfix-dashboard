import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

// ========================================
// OAuth Interfaces
// ========================================

export interface OAuthAuthorizeResponse {
  authorization_url: string;
  state: string;
}

export interface OAuthConnection {
  id: string;
  provider: 'github' | 'gitlab';
  username: string;
  email: string;
  avatar_url: string;
  scopes: string[];
  token_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OAuthConnectionsResponse {
  connections: OAuthConnection[];
}

// ========================================
// Repository Interfaces
// ========================================

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  description: string | null;
  private: boolean;
  default_branch: string;
  html_url: string;
  is_connected: boolean;
  connection_id?: string;
}

export interface RepositoryListResponse {
  repositories: Repository[];
  total_count: number;
}

export interface ConnectRepositoryRequest {
  repository_full_name: string;
  auto_pr_enabled?: boolean;
  setup_webhook?: boolean;
  webhook_events?: string[];
}

export interface RepositoryConnection {
  id: string;
  repository_full_name: string;
  provider: 'github' | 'gitlab';
  is_enabled: boolean;
  auto_pr_enabled: boolean;
  webhook_configured: boolean;
  webhook_id: string | null;
  webhook_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface RepositoryConnectionsResponse {
  connections: RepositoryConnection[];
  total: number;
}

export interface RepositoryStatsResponse {
  total_repositories: number;
  active_count: number;
  inactive_count: number;
  webhook_count: number;
}

// ========================================
// Workflow Interfaces
// ========================================

export interface WorkflowRun {
  id: string;
  run_id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null;
  created_at: string;
  updated_at: string;
  run_started_at: string;
  html_url: string;
  duration_seconds: number | null;
  repository_connection_id: string;
}

export interface WorkflowRunsResponse {
  runs: WorkflowRun[];
  total: number;
  page: number;
  per_page: number;
}

export interface WorkflowStatsResponse {
  total_runs: number;
  failed_runs: number;
  successful_runs: number;
  success_rate: number;
  average_duration_seconds: number;
}

// ========================================
// Pull Request Interfaces
// ========================================

export interface CreatePRRequest {
  incident_id: string;
  branch_name?: string;
  use_ai_analysis?: boolean;
  auto_commit?: boolean;
  draft_pr?: boolean;
}

export interface PullRequest {
  id: string;
  incident_id: string;
  pr_number: number;
  pr_url: string;
  repository: string;
  title: string;
  state: string;
  created_at: string;
  merged_at: string | null;
  closed_at: string | null;
}

export interface PRStatsResponse {
  total_prs: number;
  merged_count: number;
  merge_rate: number;
  success_rate: number;
}

// ========================================
// Analytics Interfaces
// ========================================

export interface TrendDataPoint {
  date: string;
  total_runs?: number;
  failed_runs?: number;
  success_rate?: number;
  incidents_created?: number;
  incidents_resolved?: number;
}

export interface WorkflowTrendsResponse {
  trends: TrendDataPoint[];
  period: string;
  days: number;
}

export interface RepositoryHealth {
  repository_connection_id: string;
  repository_name: string;
  health_score: number;
  total_workflows: number;
  failed_workflows: number;
  total_incidents: number;
  resolved_incidents: number;
}

export interface IncidentTrendsResponse {
  trends: TrendDataPoint[];
  period: string;
  days: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  total_repositories: number;
  active_repositories: number;
  total_workflows: number;
  recent_failures: number;
  alerts: string[];
}

export interface DashboardSummary {
  repositories: {
    total: number;
    active: number;
    with_webhooks: number;
  };
  workflows: {
    total_runs: number;
    failed_runs: number;
    success_rate: number;
  };
  prs: {
    total: number;
    merged: number;
    merge_rate: number;
  };
  incidents: {
    total: number;
    resolved: number;
    resolution_rate: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DevflowfixService {
  private apiUrl = 'https://devflowfix-new-production.up.railway.app/api/v2';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get HTTP headers with Bearer token authentication
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ========================================
  // OAuth Methods
  // ========================================

  /**
   * Start GitHub OAuth flow
   */
  authorizeGitHub(): Observable<OAuthAuthorizeResponse> {
    return this.http.post<OAuthAuthorizeResponse>(
      `${this.apiUrl}/oauth/github/authorize`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get GitHub connection status
   */
  getGitHubConnection(): Observable<OAuthConnection> {
    return this.http.get<OAuthConnection>(
      `${this.apiUrl}/oauth/github/connection`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Disconnect GitHub OAuth
   */
  disconnectGitHub(): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/oauth/github/disconnect`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Start GitLab OAuth flow
   */
  authorizeGitLab(): Observable<OAuthAuthorizeResponse> {
    return this.http.post<OAuthAuthorizeResponse>(
      `${this.apiUrl}/oauth/gitlab/authorize`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Refresh GitLab token
   */
  refreshGitLabToken(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/oauth/gitlab/refresh`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get GitLab connection status
   */
  getGitLabConnection(): Observable<OAuthConnection> {
    return this.http.get<OAuthConnection>(
      `${this.apiUrl}/oauth/gitlab/connection`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Disconnect GitLab OAuth
   */
  disconnectGitLab(): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/oauth/gitlab/disconnect`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * List all OAuth connections
   */
  listOAuthConnections(): Observable<OAuthConnectionsResponse> {
    return this.http.get<OAuthConnectionsResponse>(
      `${this.apiUrl}/oauth/connections`,
      { headers: this.getHeaders() }
    );
  }

  // ========================================
  // Repository Methods
  // ========================================

  /**
   * List GitHub repositories
   */
  listGitHubRepositories(
    page: number = 1,
    perPage: number = 30,
    sort: string = 'updated',
    direction: string = 'desc'
  ): Observable<RepositoryListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('sort', sort)
      .set('direction', direction);

    return this.http.get<RepositoryListResponse>(
      `${this.apiUrl}/repositories/github`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * List GitLab projects
   */
  listGitLabProjects(page: number = 1, perPage: number = 30): Observable<RepositoryListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<RepositoryListResponse>(
      `${this.apiUrl}/repositories/gitlab`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Connect a GitHub repository
   */
  connectRepository(data: ConnectRepositoryRequest): Observable<RepositoryConnection> {
    return this.http.post<RepositoryConnection>(
      `${this.apiUrl}/repositories/connect`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Connect a GitLab repository
   */
  connectGitLabRepository(data: ConnectRepositoryRequest): Observable<RepositoryConnection> {
    return this.http.post<RepositoryConnection>(
      `${this.apiUrl}/repositories/gitlab/connect`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /**
   * List repository connections
   */
  listRepositoryConnections(includeDisabled: boolean = false): Observable<RepositoryConnectionsResponse> {
    const params = new HttpParams().set('include_disabled', includeDisabled.toString());

    return this.http.get<RepositoryConnectionsResponse>(
      `${this.apiUrl}/repositories/connections`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Get single repository connection
   */
  getRepositoryConnection(connectionId: string): Observable<RepositoryConnection> {
    return this.http.get<RepositoryConnection>(
      `${this.apiUrl}/repositories/connections/${connectionId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Update repository connection
   */
  updateRepositoryConnection(
    connectionId: string,
    data: { is_enabled?: boolean; auto_pr_enabled?: boolean }
  ): Observable<RepositoryConnection> {
    return this.http.patch<RepositoryConnection>(
      `${this.apiUrl}/repositories/connections/${connectionId}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Disconnect repository
   */
  disconnectRepository(connectionId: string, deleteWebhook: boolean = true): Observable<any> {
    const params = new HttpParams().set('delete_webhook', deleteWebhook.toString());

    return this.http.delete(
      `${this.apiUrl}/repositories/connections/${connectionId}`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Get repository statistics
   */
  getRepositoryStats(): Observable<RepositoryStatsResponse> {
    return this.http.get<RepositoryStatsResponse>(
      `${this.apiUrl}/repositories/stats`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Sync workflows for a repository
   */
  syncWorkflows(
    connectionId: string,
    limit: number = 30,
    statusFilter?: string
  ): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    if (statusFilter) {
      params = params.set('status_filter', statusFilter);
    }

    return this.http.post(
      `${this.apiUrl}/repositories/${connectionId}/sync/workflows`,
      {},
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Sync PRs for a repository
   */
  syncPRs(connectionId: string, state: string = 'all', limit: number = 30): Observable<any> {
    const params = new HttpParams()
      .set('state', state)
      .set('limit', limit.toString());

    return this.http.post(
      `${this.apiUrl}/repositories/${connectionId}/sync/prs`,
      {},
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Sync all data for a repository
   */
  syncAll(
    connectionId: string,
    syncWorkflows: boolean = true,
    syncPRs: boolean = true
  ): Observable<any> {
    const params = new HttpParams()
      .set('sync_workflows', syncWorkflows.toString())
      .set('sync_prs', syncPRs.toString());

    return this.http.post(
      `${this.apiUrl}/repositories/${connectionId}/sync`,
      {},
      { headers: this.getHeaders(), params }
    );
  }

  // ========================================
  // Workflow Methods
  // ========================================

  /**
   * List workflow runs
   */
  listWorkflowRuns(
    repositoryConnectionId?: string,
    statusFilter?: string,
    conclusionFilter?: string,
    limit: number = 50,
    page: number = 1
  ): Observable<WorkflowRunsResponse> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString());

    if (repositoryConnectionId) {
      params = params.set('repository_connection_id', repositoryConnectionId);
    }
    if (statusFilter) {
      params = params.set('status_filter', statusFilter);
    }
    if (conclusionFilter) {
      params = params.set('conclusion_filter', conclusionFilter);
    }

    return this.http.get<WorkflowRunsResponse>(
      `${this.apiUrl}/workflows/runs`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Get single workflow run
   */
  getWorkflowRun(runId: string): Observable<WorkflowRun> {
    return this.http.get<WorkflowRun>(
      `${this.apiUrl}/workflows/runs/${runId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get workflow statistics
   */
  getWorkflowStats(repositoryConnectionId?: string): Observable<WorkflowStatsResponse> {
    let params = new HttpParams();
    if (repositoryConnectionId) {
      params = params.set('repository_connection_id', repositoryConnectionId);
    }

    return this.http.get<WorkflowStatsResponse>(
      `${this.apiUrl}/workflows/stats`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Rerun a workflow
   */
  rerunWorkflow(runId: string, retryFailedJobs: boolean = false): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/workflows/runs/${runId}/rerun`,
      { retry_failed_jobs: retryFailedJobs },
      { headers: this.getHeaders() }
    );
  }

  // ========================================
  // Pull Request Methods
  // ========================================

  /**
   * Create a PR for an incident
   */
  createPR(data: CreatePRRequest): Observable<PullRequest> {
    return this.http.post<PullRequest>(
      `${this.apiUrl}/prs/create`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get PRs for an incident
   */
  getPRsForIncident(incidentId: string): Observable<{ prs: PullRequest[] }> {
    return this.http.get<{ prs: PullRequest[] }>(
      `${this.apiUrl}/prs/incidents/${incidentId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get PR status
   */
  getPRStatus(owner: string, repo: string, prNumber: number): Observable<PullRequest> {
    return this.http.get<PullRequest>(
      `${this.apiUrl}/prs/${owner}/${repo}/${prNumber}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get PR statistics
   */
  getPRStats(): Observable<PRStatsResponse> {
    return this.http.get<PRStatsResponse>(
      `${this.apiUrl}/prs/stats`,
      { headers: this.getHeaders() }
    );
  }

  // ========================================
  // Analytics Methods
  // ========================================

  /**
   * Get workflow trends
   */
  getWorkflowTrends(
    days: number = 30,
    period: string = 'day',
    repositoryConnectionId?: string
  ): Observable<WorkflowTrendsResponse> {
    let params = new HttpParams()
      .set('days', days.toString())
      .set('period', period);

    if (repositoryConnectionId) {
      params = params.set('repository_connection_id', repositoryConnectionId);
    }

    return this.http.get<WorkflowTrendsResponse>(
      `${this.apiUrl}/analytics/workflows/trends`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Get repository health metrics
   */
  getRepositoryHealth(repositoryConnectionId?: string): Observable<RepositoryHealth> {
    let params = new HttpParams();
    if (repositoryConnectionId) {
      params = params.set('repository_connection_id', repositoryConnectionId);
    }

    return this.http.get<RepositoryHealth>(
      `${this.apiUrl}/analytics/repositories/health`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Get incident trends
   */
  getIncidentTrends(days: number = 30, period: string = 'day'): Observable<IncidentTrendsResponse> {
    const params = new HttpParams()
      .set('days', days.toString())
      .set('period', period);

    return this.http.get<IncidentTrendsResponse>(
      `${this.apiUrl}/analytics/incidents/trends`,
      { headers: this.getHeaders(), params }
    );
  }

  /**
   * Get system health
   */
  getSystemHealth(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(
      `${this.apiUrl}/analytics/system/health`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Get dashboard summary
   */
  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${this.apiUrl}/analytics/dashboard`,
      { headers: this.getHeaders() }
    );
  }
}
