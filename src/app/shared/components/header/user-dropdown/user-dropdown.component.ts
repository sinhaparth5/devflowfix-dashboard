import { Component, inject } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService, ZitadelUser } from '../../../../auth';
import { OnboardingService } from '../../../services/onboarding.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent, DropdownItemTwoComponent]
})
export class UserDropdownComponent {
  private authService = inject(AuthService);
  private onboardingService = inject(OnboardingService);

  isOpen = false;

  // Reactive user from Zitadel service
  get currentUser(): ZitadelUser | null {
    return this.authService.user();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  handleSignout() {
    this.authService.logout();
  }

  getAvatarUrl(): string {
    return this.currentUser?.picture || '/images/user/owner.png';
  }

  getUserName(): string {
    const user = this.currentUser;
    return user?.name || user?.preferred_username || 'User';
  }

  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  restartTour(): void {
    this.closeDropdown();
    this.onboardingService.restartTour();
  }
}
