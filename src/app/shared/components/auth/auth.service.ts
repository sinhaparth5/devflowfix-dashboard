import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, tap, catchError } from "rxjs";
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
    full_name: string;
    role: string;
    is_active: boolean;
    is_mfa_enabled: boolean;
    avatar_url?: string;
    github_username?: string;
    organization_id?: string;
    team_id?: string;
    preferences?: any;
    created_at: string;
    updated_at: string;
}

export interface UpdateUserRequest {
    full_name?: string;
    github_username?: string;
    organization_id?: string;
    team_id?: string;
    preferences?: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://devflowfix-new-production.up.railway.app/api/v1/auth';
    private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private refreshingToken = false;

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
                this.router.navigate(['/']);
            })
        );
    }

    /**
     * Refresh access token
     */
    refreshToken(): Observable<any> {
        this.refreshingToken = true;
        const refreshToken = this.getRefreshToken();
        return this.http.post(`${this.apiUrl}/refresh`, {
            refresh_token: refreshToken
        }).pipe(
            tap((response: any) => {
                this.setCookie('access_token', response.access_token, 7);
                this.setCookie('refresh_token', response.refresh_token, 30);
                this.refreshingToken = false;
            }),
            catchError((error) => {
                this.refreshingToken = false;
                throw error;
            })
        );
    }

    /**
     * Check if currently refreshing token
     */
    isRefreshing(): boolean {
        return this.refreshingToken;
    }

    /**
     * Clear auth data without API call (used when refresh fails)
     */
    clearAuth(): void {
        this.clearAuthData();
        this.router.navigate(['/']);
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
                    this.setCookie('current_user', JSON.stringify(user), 30);
                })
            );
    }

    /**
     * Store authentication data
     */
    private storeAuthData(response: LoginResponse): void {
        this.setCookie('access_token', response.access_token, 7);
        this.setCookie('refresh_token', response.refresh_token, 30);
        this.setCookie('current_user', JSON.stringify(response.user), 30);
        this.currentUserSubject.next(response.user);
    }

    /**
     * Clear authentication data
     */
    private clearAuthData(): void {
        this.deleteCookie('access_token');
        this.deleteCookie('refresh_token');
        this.deleteCookie('current_user');
        this.currentUserSubject.next(null);
    }

    /**
     * Load user from storage
     */
    private loadUserFromStorage(): void {
        const userStr = this.getCookie('current_user');
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
        return this.getCookie('access_token');
    }

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        return this.getCookie('refresh_token');
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
     * Upload/Update user avatar
     */
    updateAvatar(file: File): Observable<any> {
        const token = this.getAccessToken();
        const formData = new FormData();
        formData.append('avatar_file', file);

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.apiUrl}/me/avatar`, formData, { headers })
            .pipe(
                tap((response: any) => {
                    const currentUser = this.getCurrentUser();
                    if (currentUser && response.avatar_url) {
                        currentUser.avatar_url = response.avatar_url;
                        this.setCookie('current_user', JSON.stringify(currentUser), 30);
                        this.currentUserSubject.next(currentUser);
                    }
                })
            );
    }

    /**
     * Update user information
     */
    updateUserInfo(userData: UpdateUserRequest): Observable<UserResponse> {
        const token = this.getAccessToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.patch<UserResponse>(`${this.apiUrl}/me`, userData, { headers })
            .pipe(
                tap(user => {
                    this.currentUserSubject.next(user);
                    this.setCookie('current_user', JSON.stringify(user), 30);
                })
            );
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

    /**
     * Set a cookie
     */
    private setCookie(name: string, value: string, days: number): void {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${secure}`;
    }

    /**
     * Get a cookie
     */
    private getCookie(name: string): string | null {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }

    /**
     * Delete a cookie
     */
    private deleteCookie(name: string): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}