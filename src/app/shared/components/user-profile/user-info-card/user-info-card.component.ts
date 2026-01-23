import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, ZitadelUser } from '../../../../auth';

@Component({
  selector: 'app-user-info-card',
  imports: [
    CommonModule,
  ],
  templateUrl: './user-info-card.component.html',
  styles: ``
})
export class UserInfoCardComponent {
  private authService = inject(AuthService);

  // Get current user from Zitadel
  get currentUser(): ZitadelUser | null {
    return this.authService.user();
  }

  getFullName(): string {
    const user = this.currentUser;
    return user?.name || user?.preferred_username || 'Not set';
  }

  getEmail(): string {
    return this.currentUser?.email || 'Not set';
  }

  getRole(): string {
    return 'User';
  }
}
