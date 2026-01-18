import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WebhookGenerateResponse {
  success: boolean;
  message: string;
  user: {
    user_id: string;
    email: string;
    full_name: string;
  };
  webhook_secret: string;
  webhook_url: string;
  secret_length: number;
  algorithm: string;
  created_at: string;
  github_configuration: {
    payload_url: string;
    content_type: string;
    secret: string;
    ssl_verification: string;
    events: string[];
    active: boolean;
  };
  setup_instructions: {
    [key: string]: any;
  };
  test_configuration: {
    description: string;
    curl_command: string;
    generate_test_signature: string;
  };
}

export interface WebhookConfiguration {
  secret_configured: boolean;
  secret_preview: string | null;
  secret_length: number;
  webhook_url: string;
  last_updated: string | null;
}

export interface WebhookInfoResponse {
  user: {
    user_id: string;
    email: string;
    full_name: string;
  };
  webhook_configuration: WebhookConfiguration;
  github_settings: {
    payload_url: string;
    content_type: string;
    events: string[];
    ssl_verification: string;
  };
  status: {
    ready: boolean;
    message: string;
  };
  actions: {
    generate_new_secret: string;
    test_signature: string;
    webhook_endpoint: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WebhookService {
  private apiUrl = 'https://api.devflowfix.com/api/v1/webhook';

  constructor(private http: HttpClient) {}

  /**
   * Generate webhook secret
   */
  generateWebhookSecret(): Observable<WebhookGenerateResponse> {
    return this.http.post<WebhookGenerateResponse>(
      `${this.apiUrl}/secret/generate/me`,
      {}
    );
  }

  /**
   * Get webhook configuration info
   */
  getWebhookInfo(): Observable<WebhookInfoResponse> {
    return this.http.get<WebhookInfoResponse>(
      `${this.apiUrl}/secret/info/me`
    );
  }
}
