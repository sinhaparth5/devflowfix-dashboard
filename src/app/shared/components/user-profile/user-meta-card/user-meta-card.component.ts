import { Component, ViewChild, ElementRef } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { AuthService, UserResponse, UpdateUserRequest } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SanitizationService } from '../../../services/sanitization.service';

@Component({
  selector: 'app-user-meta-card',
  imports: [
    CommonModule,
    ModalComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  currentUser$: Observable<UserResponse | null>;
  isOpen = false;
  isUploading = false;
  isSaving = false;
  uploadError: string | null = null;
  saveError: string | null = null;
  userForm: FormGroup;

  // Example user data (could be made dynamic)
  user = {
    firstName: 'Musharof',
    lastName: 'Chowdhury',
    role: 'Team Manager',
    location: 'Arizona, United States',
    avatar: '/images/user/owner.jpg',
    social: {
      facebook: 'https://www.facebook.com/PimjoHQ',
      x: 'https://x.com/PimjoHQ',
      linkedin: 'https://www.linkedin.com/company/pimjo',
      instagram: 'https://instagram.com/PimjoHQ',
    },
    email: 'randomuser@pimjo.com',
    phone: '+09 363 398 46',
    bio: 'Team Manager',
  };

  constructor(
    public modal: ModalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private sanitizationService: SanitizationService
  ) {
    this.currentUser$ = this.authService.currentUser$;

    this.userForm = this.fb.group({
      full_name: [''],
      github_username: [''],
      email: [{value: '', disabled: true}],
    });

    // Subscribe to current user and update form
    this.currentUser$.subscribe(user => {
      if (user) {
        this.userForm.patchValue({
          full_name: user.full_name || '',
          github_username: user.github_username || '',
          email: user.email || '',
        });
      }
    });
  }

  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  getAvatarUrl(user: UserResponse | null): string {
    return user?.avatar_url || '/images/user/owner.jpg';
  }

  getUserName(user: UserResponse | null): string {
    return user?.full_name || 'User';
  }

  getUserRole(user: UserResponse | null): string {
    return user?.role || 'User';
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Use sanitization service for validation
      const validation = this.sanitizationService.validateFile(file, {
        allowedTypes: ['image/'],
        maxSize: 5 * 1024 * 1024 // 5MB
      });

      if (!validation.valid) {
        this.uploadError = validation.error || 'Invalid file';
        return;
      }

      this.uploadAvatar(file);
    }
  }

  uploadAvatar(file: File) {
    this.isUploading = true;
    this.uploadError = null;

    this.authService.updateAvatar(file).subscribe({
      next: () => {
        this.isUploading = false;
        console.log('Avatar updated successfully');
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadError = error.error?.message || 'Failed to upload avatar';
        console.error('Avatar upload failed:', error);
      }
    });
  }

  handleSave() {
    if (this.userForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.saveError = null;

    // Sanitize form values before sending
    const updateData: UpdateUserRequest = {
      full_name: this.sanitizationService.sanitizeText(
        this.userForm.get('full_name')?.value
      ),
      github_username: this.sanitizationService.sanitizeText(
        this.userForm.get('github_username')?.value
      ),
    };

    this.authService.updateUserInfo(updateData).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        console.log('User information updated successfully');
      },
      error: (error) => {
        this.isSaving = false;
        this.saveError = error.error?.message || 'Failed to update user information';
        console.error('Update failed:', error);
      }
    });
  }
}
