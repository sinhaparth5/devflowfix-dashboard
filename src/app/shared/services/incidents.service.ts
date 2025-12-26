import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

// Incident Interfaces
export interface Incident {
  incident_id: string;
  source: string;
  severity: string;
  outcome: string;
  failure_type: string;
  error_log: string;
  created_at: string;
  resolved_at: string | null;
  user_id: string;
}

export interface IncidentDetail extends Incident {
  description?: string;
  analysis?: string;
  remediation_steps?: string[];
  context?: any;
  stack_trace?: string;
  affected_services?: string[];
  repository?: string;
  branch?: string;
  commit_hash?: string;
  pr_id?: string;
  pr_url?: string;
  updated_at?: string;
  metadata?: any;
}

export interface IncidentsListResponse {
  incidents: Incident[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export interface IncidentStatsResponse {
  total_incidents: number;
  resolved_count: number;
  failed_count: number;
  pending_count: number;
  escalated_count: number;
  rolled_back_count: number;
  success_rate: number;
  average_resolution_time: number;
  by_source: { [key: string]: number };
  by_severity: { [key: string]: number };
  by_failure_type: { [key: string]: number };
}

export interface IncidentFilters {
  skip?: number;
  limit?: number;
  source?: string;
  severity?: string;
  outcome?: string;
  failure_type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  user_id?: string;
}

export interface AssignIncidentRequest {
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
  private apiUrl = 'https://devflowfix-new-production.up.railway.app/api/v1/incidents';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private buildParams(filters?: IncidentFilters): HttpParams {
    let params = new HttpParams();

    if (filters) {
      if (filters.skip !== undefined) params = params.set('skip', filters.skip.toString());
      if (filters.limit !== undefined) params = params.set('limit', filters.limit.toString());
      if (filters.source) params = params.set('source', filters.source);
      if (filters.severity) params = params.set('severity', filters.severity);
      if (filters.outcome) params = params.set('outcome', filters.outcome);
      if (filters.failure_type) params = params.set('failure_type', filters.failure_type);
      if (filters.start_date) params = params.set('start_date', filters.start_date);
      if (filters.end_date) params = params.set('end_date', filters.end_date);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.user_id) params = params.set('user_id', filters.user_id);
    }

    return params;
  }

  /**
   * List user incidents with optional filters
   */
  listIncidents(filters?: IncidentFilters): Observable<IncidentsListResponse> {
    const params = this.buildParams(filters);

    return this.http.get<IncidentsListResponse>(`${this.apiUrl}`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get detailed information about a specific incident
   */
  getIncident(incidentId: string): Observable<IncidentDetail> {
    return this.http.get<IncidentDetail>(`${this.apiUrl}/${incidentId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Get incident statistics for the current user
   */
  getIncidentStats(startDate?: string, endDate?: string): Observable<IncidentStatsResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<IncidentStatsResponse>(`${this.apiUrl}/stats`, {
      headers: this.getHeaders(),
      params
    });
  }

  // ================== ADMIN ENDPOINTS ==================

  /**
   * List all incidents (Admin only)
   */
  adminListAllIncidents(filters?: IncidentFilters): Observable<IncidentsListResponse> {
    const params = this.buildParams(filters);

    return this.http.get<IncidentsListResponse>(`${this.apiUrl}/admin/all`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get global incident statistics (Admin only)
   */
  adminGetGlobalStats(startDate?: string, endDate?: string): Observable<IncidentStatsResponse> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<IncidentStatsResponse>(`${this.apiUrl}/admin/stats`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Assign incident to a user (Admin only)
   */
  adminAssignIncident(incidentId: string, userId: string): Observable<any> {
    const body: AssignIncidentRequest = { user_id: userId };

    return this.http.post(`${this.apiUrl}/${incidentId}/assign`, body, {
      headers: this.getHeaders()
    });
  }
}
