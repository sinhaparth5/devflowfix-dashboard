import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../components/auth/auth.service';

export interface IncidentStats {
  total_incidents: number;
  resolved_incidents: number;
  failed_incidents: number;
  pending_incidents: number;
  escalated_incidents: number;
  rolled_back_incidents: number;
  success_rate: number;
  average_resolution_time_seconds: number | null;
}

export interface BreakdownData {
  [key: string]: number;
}

export interface TrendDataPoint {
  period: string;
  total: number;
  resolved: number;
  failed: number;
  success_rate: number;
}

export interface MTTRData {
  average_seconds: number;
  min_seconds: number;
  max_seconds: number;
  median_seconds: number;
  p95_seconds: number;
  sample_size: number;
}

export interface AutoFixRateData {
  total_incidents: number;
  auto_fixed: number;
  escalated: number;
  auto_fix_rate: number;
  escalation_rate: number;
}

export interface TopFailureType {
  failure_type: string;
  count: number;
  percentage: number;
}

export interface TopRepository {
  repository: string;
  incident_count: number;
  auto_fix_rate: number;
}

export interface RemediationSuccess {
  action_type: string;
  total_attempts: number;
  successful: number;
  success_rate: number;
}

export interface UserFeedback {
  total_feedback: number;
  positive: number;
  negative: number;
  satisfaction_rate: number;
  average_rating: number;
}

export interface AnalyticsOverview {
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  summary: {
    total_incidents: number;
    success_rate: number;
  };
  breakdown: {
    by_source: BreakdownData;
    by_severity: BreakdownData;
    by_outcome: BreakdownData;
  };
  trends: TrendDataPoint[];
  performance: {
    mttr: MTTRData;
    auto_fix_rate: AutoFixRateData;
  };
  top_failure_types: TopFailureType[];
  hourly_distribution: BreakdownData;
  generated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'https://devflowfix-new-production.up.railway.app/api/v1/analytics';

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

  /**
   * Get incident statistics
   */
  getStats(startDate?: string, endDate?: string, source?: string): Observable<IncidentStats> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    if (source) params = params.set('source', source);

    return this.http.get<IncidentStats>(`${this.apiUrl}/stats`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get breakdown by source
   */
  getBreakdownBySource(startDate?: string, endDate?: string): Observable<BreakdownData> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<BreakdownData>(`${this.apiUrl}/breakdown/source`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get breakdown by severity
   */
  getBreakdownBySeverity(startDate?: string, endDate?: string): Observable<BreakdownData> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<BreakdownData>(`${this.apiUrl}/breakdown/severity`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get breakdown by failure type
   */
  getBreakdownByFailureType(startDate?: string, endDate?: string): Observable<BreakdownData> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<BreakdownData>(`${this.apiUrl}/breakdown/failure-type`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get breakdown by outcome
   */
  getBreakdownByOutcome(startDate?: string, endDate?: string): Observable<BreakdownData> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<BreakdownData>(`${this.apiUrl}/breakdown/outcome`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get incident trends
   */
  getTrends(days: number = 30, granularity: 'hour' | 'day' | 'week' = 'day'): Observable<TrendDataPoint[]> {
    const params = new HttpParams()
      .set('days', days.toString())
      .set('granularity', granularity);

    return this.http.get<TrendDataPoint[]>(`${this.apiUrl}/trends`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get MTTR (Mean Time To Repair)
   */
  getMTTR(startDate?: string, endDate?: string, source?: string): Observable<MTTRData> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    if (source) params = params.set('source', source);

    return this.http.get<MTTRData>(`${this.apiUrl}/mttr`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get auto-fix rate
   */
  getAutoFixRate(startDate?: string, endDate?: string): Observable<AutoFixRateData> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<AutoFixRateData>(`${this.apiUrl}/auto-fix-rate`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get confidence score distribution
   */
  getConfidenceDistribution(startDate?: string, endDate?: string): Observable<BreakdownData> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<BreakdownData>(`${this.apiUrl}/confidence-distribution`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get remediation success by action type
   */
  getRemediationSuccess(startDate?: string, endDate?: string): Observable<RemediationSuccess[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<RemediationSuccess[]>(`${this.apiUrl}/remediation-success`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get user feedback summary
   */
  getFeedback(startDate?: string, endDate?: string): Observable<UserFeedback> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<UserFeedback>(`${this.apiUrl}/feedback`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get top failure types
   */
  getTopFailureTypes(limit: number = 10, startDate?: string, endDate?: string): Observable<TopFailureType[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<TopFailureType[]>(`${this.apiUrl}/top/failure-types`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get top repositories
   */
  getTopRepositories(limit: number = 10, startDate?: string, endDate?: string): Observable<TopRepository[]> {
    let params = new HttpParams().set('limit', limit.toString());
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<TopRepository[]>(`${this.apiUrl}/top/repositories`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get hourly distribution
   */
  getHourlyDistribution(days: number = 30): Observable<BreakdownData> {
    const params = new HttpParams().set('days', days.toString());

    return this.http.get<BreakdownData>(`${this.apiUrl}/distribution/hourly`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get daily distribution
   */
  getDailyDistribution(days: number = 30): Observable<BreakdownData> {
    const params = new HttpParams().set('days', days.toString());

    return this.http.get<BreakdownData>(`${this.apiUrl}/distribution/daily`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get comprehensive analytics overview
   */
  getOverview(days: number = 30): Observable<AnalyticsOverview> {
    const params = new HttpParams().set('days', days.toString());

    return this.http.get<AnalyticsOverview>(`${this.apiUrl}/overview`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get dashboard summary
   */
  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`, {
      headers: this.getHeaders()
    });
  }
}
