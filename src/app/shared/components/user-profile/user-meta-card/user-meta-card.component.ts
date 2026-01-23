import { Component, ViewChild, ElementRef, OnInit, inject } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { AuthService, ZitadelUser } from '../../../../auth';
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

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private sanitizationService = inject(SanitizationService);
  private userDetailsService = inject(UserDetailsService);
  public modal = inject(ModalService);

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

  // Get current user from Zitadel
  get currentUser(): ZitadelUser | null {
    return this.authService.user();
  }

  constructor() {
    // Form only contains fields that can be updated via user-details API
    this.userForm = this.fb.group({
      facebook_link: [''],
      twitter_link: [''],
      linkedin_link: [''],
      instagram_link: [''],
      github_link: [''],
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

  getAvatarUrl(): string {
    return this.currentUser?.picture || '/images/user/owner.jpg';
  }

  getUserName(): string {
    const user = this.currentUser;
    return user?.name || user?.preferred_username || 'User';
  }

  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  getUserRole(): string {
    // Role is not available in Zitadel claims by default, return a default value
    return 'User';
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
    // Avatar is managed by Zitadel identity provider
    this.uploadError = 'Avatar is managed by your identity provider (Zitadel). Please update it there.';
  }

  handleSave(event?: Event) {
    event?.preventDefault();

    if (this.userForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.saveError = null;

    // Prepare user details data - all fields that can be updated via user-details API
    const userDetailsData: Partial<UserDetails> = {
      facebook_link: this.sanitizationService.sanitizeText(
        this.userForm.get('facebook_link')?.value
      ) || '',
      twitter_link: this.sanitizationService.sanitizeText(
        this.userForm.get('twitter_link')?.value
      ) || '',
      linkedin_link: this.sanitizationService.sanitizeText(
        this.userForm.get('linkedin_link')?.value
      ) || '',
      instagram_link: this.sanitizationService.sanitizeText(
        this.userForm.get('instagram_link')?.value
      ) || '',
      github_link: this.sanitizationService.sanitizeText(
        this.userForm.get('github_link')?.value
      ) || '',
    };

    // Update user details via PUT /api/v1/user-details/me
    this.userDetailsService.updateUserDetails(userDetailsData).subscribe({
      next: (details) => {
        // Merge the response with existing data to preserve all fields
        this.userDetails = { ...this.userDetails, ...details };
        this.isSaving = false;
        this.closeModal();
      },
      error: (error) => {
        this.isSaving = false;
        this.saveError = error.error?.message || 'Failed to update user details';
        console.error('User details update failed:', error);
      }
    });
  }
}
