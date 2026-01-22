import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { AuthService, UserResponse } from '../../auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-info-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './user-info-card.component.html',
  styles: ``
})
export class UserInfoCardComponent implements OnInit {
  currentUser$: Observable<UserResponse | null>;
  isLoading = false;

  constructor(
    public modal: ModalService,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    // If no current user, try to fetch from API
    if (!this.authService.getCurrentUser()) {
      this.isLoading = true;
      this.authService.getCurrentUserProfile().subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching user profile:', error);
          this.isLoading = false;
        }
      });
    }
  }

  getFullName(user: UserResponse | null): string {
    return user?.full_name || 'Not set';
  }

  getEmail(user: UserResponse | null): string {
    return user?.email || 'Not set';
  }

  getGithubUsername(user: UserResponse | null): string {
    return user?.github_username || 'Not set';
  }

  getRole(user: UserResponse | null): string {
    return user?.role || 'Not set';
  }
}
