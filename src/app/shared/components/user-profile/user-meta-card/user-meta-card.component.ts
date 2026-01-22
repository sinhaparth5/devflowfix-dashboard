import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { AuthService, UserResponse, UpdateUserRequest } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SanitizationService } from '../../../services/sanitization.service';
import { UserDetailsService, UserDetails } from '../../../services/user-details.service';

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
export class UserMetaCardComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  currentUser$: Observable<UserResponse | null>;
  isOpen = false;
  isUploading = false;
  isSaving = false;
  isLoadingSocial = false;
  uploadError: string | null = null;
  saveError: string | null = null;
  userForm: FormGroup;

  userDetails: UserDetails = {
    country: '',
    city: '',
    postal_code: '',
    facebook_link: '',
    twitter_link: '',
    linkedin_link: '',
    instagram_link: '',
    github_link: '',
  };

  // Example user data (could be made dynamic)
  user = {
    firstName: 'Musharof',
    lastName: 'Chowdhury',
    role: 'Team Manager',
    location: 'Arizona, United States',
    avatar: '/images/user/owner.jpg',
    email: 'randomuser@pimjo.com',
    phone: '+09 363 398 46',
    bio: 'Team Manager',
  };

  constructor(
    public modal: ModalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private sanitizationService: SanitizationService,
    private userDetailsService: UserDetailsService
  ) {
    this.currentUser$ = this.authService.currentUser$;

    this.userForm = this.fb.group({
      full_name: [''],
      github_username: [''],
      email: [{value: '', disabled: true}],
      facebook_link: [''],
      twitter_link: [''],
      linkedin_link: [''],
      instagram_link: [''],
      github_link: [''],
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

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.isLoadingSocial = true;
    this.userDetailsService.getUserDetails().subscribe({
      next: (details) => {
        // Merge with existing data to preserve any fields
        this.userDetails = { ...this.userDetails, ...details };
        this.userForm.patchValue({
          facebook_link: details.facebook_link || '',
          twitter_link: details.twitter_link || '',
          linkedin_link: details.linkedin_link || '',
          instagram_link: details.instagram_link || '',
          github_link: details.github_link || '',
        });
        this.isLoadingSocial = false;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.isLoadingSocial = false;
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

  handleSave(event?: Event) {
    event?.preventDefault();

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

    // Prepare social links data
    const socialLinksData: Partial<UserDetails> = {
      facebook_link: this.sanitizationService.sanitizeText(
        this.userForm.get('facebook_link')?.value
      ),
      twitter_link: this.sanitizationService.sanitizeText(
        this.userForm.get('twitter_link')?.value
      ),
      linkedin_link: this.sanitizationService.sanitizeText(
        this.userForm.get('linkedin_link')?.value
      ),
      instagram_link: this.sanitizationService.sanitizeText(
        this.userForm.get('instagram_link')?.value
      ),
      github_link: this.sanitizationService.sanitizeText(
        this.userForm.get('github_link')?.value
      ),
    };

    // Update user info first, then social links
    this.authService.updateUserInfo(updateData).subscribe({
      next: () => {
        // Update social links
        this.userDetailsService.updateUserDetails(socialLinksData).subscribe({
          next: (details) => {
            // Merge the response with existing data to preserve all fields
            this.userDetails = { ...this.userDetails, ...details };

            // Refresh the current user profile to update the cookie and observable
            this.authService.getCurrentUserProfile().subscribe({
              next: () => {
                this.isSaving = false;
                this.closeModal();
                console.log('User information and social links updated successfully');
              },
              error: () => {
                // Even if refresh fails, the data is saved, so close modal
                this.isSaving = false;
                this.closeModal();
              }
            });
          },
          error: (error) => {
            this.isSaving = false;
            this.saveError = error.error?.message || 'Failed to update social links';
            console.error('Social links update failed:', error);
          }
        });
      },
      error: (error) => {
        this.isSaving = false;
        this.saveError = error.error?.message || 'Failed to update user information';
        console.error('Update failed:', error);
      }
    });
  }
}
