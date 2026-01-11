import { Component, EventEmitter, Output } from '@angular/core';

import { InputFieldComponent } from '../../form/input/input-field.component';
import { TextAreaComponent } from '../../form/input/text-area.component';
import { LabelComponent } from '../../form/label/label.component';
import { PrManagementService, TokenRegistration } from '../../../services/pr-management.service';

@Component({
  selector: 'app-token-registration-form',
  standalone: true,
  imports: [
    InputFieldComponent,
    TextAreaComponent,
    LabelComponent
],
  templateUrl: './token-registration-form.component.html'
})
export class TokenRegistrationFormComponent {
  // Form fields
  owner: string = '';
  repo: string = '';
  token: string = '';
  description: string = '';
  scopes: string = '';

  // Form state
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  showSuccess = false;

  // Validation errors
  ownerError = '';
  tokenError = '';

  // Event to notify parent when token is registered
  @Output() tokenRegistered = new EventEmitter<void>();

  constructor(private prManagementService: PrManagementService) {}

  /**
   * Validate form fields
   */
  validateForm(): boolean {
    let isValid = true;

    // Validate owner (required)
    if (!this.owner || !this.owner.trim()) {
      this.ownerError = 'Owner is required';
      isValid = false;
    } else {
      this.ownerError = '';
    }

    // Validate token (required)
    if (!this.token || !this.token.trim()) {
      this.tokenError = 'Token is required';
      isValid = false;
    } else {
      this.tokenError = '';
    }

    return isValid;
  }

  /**
   * Submit the form
   */
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.showSuccess = false;

    const data: TokenRegistration = {
      owner: this.owner.trim(),
      token: this.token.trim()
    };

    // Add optional fields if provided
    if (this.repo && this.repo.trim()) {
      data.repo = this.repo.trim();
    }
    if (this.description && this.description.trim()) {
      data.description = this.description.trim();
    }
    if (this.scopes && this.scopes.trim()) {
      data.scopes = this.scopes.trim();
    }

    this.prManagementService.registerToken(data).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Token registered successfully!';
        this.showSuccess = true;
        this.isSubmitting = false;

        // Reset form
        this.resetForm();

        // Emit event to notify parent
        this.tokenRegistered.emit();

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccess = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Error registering token:', error);
        this.errorMessage = error.error?.message || error.error?.detail || 'Failed to register token. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Reset form fields
   */
  resetForm(): void {
    this.owner = '';
    this.repo = '';
    this.token = '';
    this.description = '';
    this.scopes = '';
    this.ownerError = '';
    this.tokenError = '';
  }
}
