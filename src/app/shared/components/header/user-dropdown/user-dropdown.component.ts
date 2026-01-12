import { Component } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService, UserResponse } from '../../auth/auth.service';
import { OnboardingService } from '../../../services/onboarding.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemTwoComponent]
})
export class UserDropdownComponent {
  isOpen = false;
  currentUser$: Observable<UserResponse | null>;

  constructor(
    private authService: AuthService,
    private onboardingService: OnboardingService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  handleSignout() {
    this.authService.logout(false).subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }

  getAvatarUrl(user: UserResponse | null): string {
    return user?.avatar_url || '/images/user/owner.png';
  }

  getUserName(user: UserResponse | null): string {
    return user?.full_name || 'User';
  }

  getUserEmail(user: UserResponse | null): string {
    return user?.email || '';
  }

  restartTour(): void {
    this.closeDropdown();
    this.onboardingService.restartTour();
  }
}