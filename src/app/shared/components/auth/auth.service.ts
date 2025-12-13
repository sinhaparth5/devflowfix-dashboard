import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { Router } from "@angular/router";

export interface UserCreate {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    device_fingerprint?: string;
    mfa_code?: string;
    remember_me?: boolean;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: UserResponse
}

export interface UserResponse {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    is_mfa_enabled: boolean;
    created_at: string;
    updated_at: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://devflowfix-new-production.up.railway.app/api/v1/auth';
    private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromStorage();
    }

    /**
     * Register a new user
     */
    register(userData: UserCreate): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.apiUrl}/register`, userData);
    }

    /**
     * Login user
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        if (!credentials.device_fingerprint) {
            credentials.device_fingerprint = this.generateDeviceFingerprint();
        }

        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
        .pipe(
            tap(response => {
                this.storeAuthData(response);
            })
        );
    }

    /**
     * Logout user
     */
    logout(allSessions: boolean = false): Observable<any> {
        const token = this.getAccessToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.apiUrl}/logout`,
            { all_sessions: allSessions },
            { headers }
        ).pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigate(['/signing']);
            })
        );
    }

    /**
     * Refresh access token
     */
    refreshToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        return this.http.post(`${this.apiUrl}/refresh`, {
            refresh_token: refreshToken
        }).pipe(
            tap((response: any) => {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
            })
        );
    }

    /**
     * Get current user profile
     */
    getCurrentUserProfile(): Observable<UserResponse> {
        const token = this.getAccessToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<UserResponse>(`${this.apiUrl}/me`, { headers })
            .pipe(
                tap(user => {
                    this.currentUserSubject.next(user);
                    localStorage.setItem('current_user', JSON.stringify(user));
                })
            );
    }

    /**
     * Store authentication data
     */
    private storeAuthData(response: LoginResponse): void {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('current_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
    }

    /**
     * Clear authentication data
     */
    private clearAuthData(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
        this.currentUserSubject.next(null);
    }

    /**
     * Load user from storage
     */
    private loadUserFromStorage(): void {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                this.currentUserSubject.next(user);
            } catch (e) {
                console.error('Error parsing stored user data', e);
            }
        }
    }

    /**
     * Get access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }

    /**
     * Get current user value
     */
    getCurrentUser(): UserResponse | null {
        return this.currentUserSubject.value;
    }

    /**
     * Generate simple device fingerprint
     */
    private generateDeviceFingerprint(): string {
        const navigator = window.navigator;
        const screen = window.screen;

        const browserInfo = [
            navigator.platform || 'unknown',
            screen.width + 'x' + screen.height,
            navigator.language || 'unknown',
            new Date().getTimezoneOffset().toString()
        ].join('|');

        let hash = 0;
        for (let i = 0; i < browserInfo.length; i++) {
            const char = browserInfo.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        const platform = (navigator.platform || 'unknown').substring(0, 20);
        const resolution = `${screen.width}x${screen.height}`;
        const hashStr = Math.abs(hash).toString(16);
        const timestamp = Date.now().toString(36);

        return `${platform}-${resolution}-${hashStr}-${timestamp}`;
    }
}