import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDetails {
  country: string;
  city: string;
  postal_code: string;
  facebook_link: string;
  twitter_link: string;
  linkedin_link: string;
  instagram_link: string;
  github_link: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private apiUrl = 'https://api.devflowfix.com/api/v1/user-details/me';

  constructor(private http: HttpClient) {}

  /**
   * Get user details
   */
  getUserDetails(): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.apiUrl);
  }

  /**
   * Update user details
   */
  updateUserDetails(details: Partial<UserDetails>): Observable<UserDetails> {
    return this.http.put<UserDetails>(this.apiUrl, details);
  }
}
