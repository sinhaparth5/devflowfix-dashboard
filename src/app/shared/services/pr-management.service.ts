import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

// Token Management Interfaces
export interface TokenRegistration {
  owner: string;
  repo?: string;
  token: string;
  description?: string;
  scopes?: string;
}

export interface GitHubToken {
  token_id: string;
  owner: string;
  repo: string | null;
  token_masked: string;
  scopes: string[];
  is_active: boolean;
  created_at: string;
  description?: string;
}

export interface TokenListResponse {
  success: boolean;
  count: number;
  tokens: GitHubToken[];
}

export interface TokenRegistrationResponse {
  success: boolean;
  message: string;
  token: {
    token_id: string;
    owner: string;
    repo: string | null;
    scopes: string[];
    created_at: string;
  };
}

export interface TokenDeactivationResponse {
  success: boolean;
  message: string;
}

// Pull Request Interfaces
export interface PullRequest {
  id: string;
  incident_id: string;
  pr_number: number;
  pr_url: string;
  repository: string;
  title: string;
  branch: string;
  status: string;
  failure_type: string;
  confidence_score: number;
  files_changed: number;
  additions: number;
  deletions: number;
  created_at: string;
  merged_at: string | null;
  approved_by: string | null;
}

export interface PRDetails extends PullRequest {
  description: string;
  base_branch: string;
  root_cause: string;
  commits_count: number;
  review_comments_count: number;
  has_conflicts: boolean;
  updated_at: string;
  closed_at: string | null;
  metadata: any;
}

export interface PRListResponse {
  success: boolean;
  total: number;
  skip: number;
  limit: number;
  prs: PullRequest[];
}

export interface PRDetailsResponse {
  success: boolean;
  pr: PRDetails;
}

export interface PRStatusUpdateResponse {
  success: boolean;
  message: string;
  pr_id: string;
  status: string;
}

// Statistics Interfaces
export interface PRStatistics {
  total_prs: number;
  merged_count: number;
  merge_rate: number;
  status_distribution: {
    [key: string]: number;
  };
  avg_files_per_pr: number;
  total_additions: number;
  total_deletions: number;
}

export interface PRStatisticsResponse {
  success: boolean;
  statistics: PRStatistics;
}

// PR List Params Interface
export interface PRListParams {
  incident_id?: string;
  repository?: string;
  status_filter?: string;
  skip?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PrManagementService {
  private apiUrl = 'https://api.devflowfix.com/api/v1/pr-management';

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
  // Token Management Methods
  // ========================================

  /**
   * Register a new GitHub Personal Access Token
   * @param data Token registration data (owner, repo, token, description, scopes)
   * @returns Observable of token registration response
   */
  registerToken(data: TokenRegistration): Observable<TokenRegistrationResponse> {
    let params = new HttpParams()
      .set('owner', data.owner)
      .set('token', data.token);

    if (data.repo) {
      params = params.set('repo', data.repo);
    }
    if (data.description) {
      params = params.set('description', data.description);
    }
    if (data.scopes) {
      params = params.set('scopes', data.scopes);
    }

    return this.http.post<TokenRegistrationResponse>(
      `${this.apiUrl}/tokens/register`,
      {},
      {
        headers: this.getHeaders(),
        params
      }
    );
  }

  /**
   * List all registered GitHub tokens for the current user
   * @param owner Optional filter by owner
   * @param activeOnly Only list active tokens (default: true)
   * @returns Observable of token list response
   */
  listTokens(owner?: string, activeOnly: boolean = true): Observable<TokenListResponse> {
    let params = new HttpParams().set('active_only', activeOnly.toString());

    if (owner) {
      params = params.set('owner', owner);
    }

    return this.http.get<TokenListResponse>(`${this.apiUrl}/tokens`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Deactivate a GitHub token (soft delete)
   * @param tokenId Token ID to deactivate
   * @returns Observable of deactivation response
   */
  deactivateToken(tokenId: string): Observable<TokenDeactivationResponse> {
    return this.http.post<TokenDeactivationResponse>(
      `${this.apiUrl}/tokens/${tokenId}/deactivate`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // ========================================
  // PR Tracking Methods
  // ========================================

  /**
   * List pull requests with optional filtering and pagination
   * @param params Optional filter parameters (incident_id, repository, status_filter, skip, limit)
   * @returns Observable of PR list response
   */
  listPRs(params: PRListParams = {}): Observable<PRListResponse> {
    let httpParams = new HttpParams();

    if (params.incident_id) {
      httpParams = httpParams.set('incident_id', params.incident_id);
    }
    if (params.repository) {
      httpParams = httpParams.set('repository', params.repository);
    }
    if (params.status_filter) {
      httpParams = httpParams.set('status_filter', params.status_filter);
    }
    if (params.skip !== undefined) {
      httpParams = httpParams.set('skip', params.skip.toString());
    }
    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PRListResponse>(`${this.apiUrl}/pulls`, {
      headers: this.getHeaders(),
      params: httpParams
    });
  }

  /**
   * Get detailed information about a specific pull request
   * @param prId Pull request ID
   * @returns Observable of PR details response
   */
  getPRDetails(prId: string): Observable<PRDetailsResponse> {
    return this.http.get<PRDetailsResponse>(`${this.apiUrl}/pulls/${prId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Update the status of a pull request
   * @param prId Pull request ID
   * @param newStatus New status value
   * @param metadata Optional metadata object
   * @returns Observable of status update response
   */
  updatePRStatus(
    prId: string,
    newStatus: string,
    metadata?: any
  ): Observable<PRStatusUpdateResponse> {
    let params = new HttpParams().set('new_status', newStatus);

    const body = metadata ? { metadata } : {};

    return this.http.post<PRStatusUpdateResponse>(
      `${this.apiUrl}/pulls/${prId}/update-status`,
      body,
      {
        headers: this.getHeaders(),
        params
      }
    );
  }

  // ========================================
  // Statistics Methods
  // ========================================

  /**
   * Get PR statistics including totals, merge rates, and code change metrics
   * @returns Observable of statistics response
   */
  getStatistics(): Observable<PRStatisticsResponse> {
    return this.http.get<PRStatisticsResponse>(`${this.apiUrl}/stats`, {
      headers: this.getHeaders()
    });
  }
}
