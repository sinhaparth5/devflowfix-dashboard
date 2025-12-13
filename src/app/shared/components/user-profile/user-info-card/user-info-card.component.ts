import { Component } from '@angular/core';
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
export class UserInfoCardComponent {
  currentUser$: Observable<UserResponse | null>;
  isOpen = false;

  user = {
    firstName: 'Musharof',
    lastName: 'Chowdhury',
    email: 'randomuser@pimjo.com',
    phone: '+09 363 398 46',
    bio: 'Team Manager',
    social: {
      facebook: 'https://www.facebook.com/PimjoHQ',
      x: 'https://x.com/PimjoHQ',
      linkedin: 'https://www.linkedin.com/company/pimjo',
      instagram: 'https://instagram.com/PimjoHQ',
    },
  };

  constructor(
    public modal: ModalService,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  getFullName(user: UserResponse | null): string {
    return user?.full_name || 'N/A';
  }

  getEmail(user: UserResponse | null): string {
    return user?.email || 'N/A';
  }

  getGithubUsername(user: UserResponse | null): string {
    return user?.github_username || 'N/A';
  }

  handleSave() {
    // Handle save logic here
    console.log('Saving changes...');
    this.modal.closeModal();
  }
}
