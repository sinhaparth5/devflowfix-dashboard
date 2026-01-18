import { Component, inject } from '@angular/core';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../auth';

@Component({
  selector: 'app-signup-form',
  imports: [
    CheckboxComponent,
    ButtonComponent,
    RouterModule,
  ],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {
  private authService = inject(AuthService);

  isLoading = false;
  isChecked = false;
  errorMessage = '';

  /**
   * Redirect to Zitadel for registration
   */
  onSignUp() {
    if (!this.isChecked) {
      this.errorMessage = 'Please accept the Terms and Conditions';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    // Redirect to Zitadel registration page
    this.authService.register('/dashboard');
  }

  /**
   * Sign up with Google via Zitadel
   */
  onGoogleSignUp() {
    if (!this.isChecked) {
      this.errorMessage = 'Please accept the Terms and Conditions';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.authService.register('/dashboard');
  }

  /**
   * Sign up with X/Twitter via Zitadel
   */
  onXSignUp() {
    if (!this.isChecked) {
      this.errorMessage = 'Please accept the Terms and Conditions';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.authService.register('/dashboard');
  }

  clearError() {
    this.errorMessage = '';
  }
}
