import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../auth';

@Component({
  selector: 'app-signin-form',
  imports: [
    ButtonComponent,
    RouterModule,
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {
  private authService = inject(AuthService);

  isLoading = false;

  /**
   * Redirect to Zitadel for authentication
   */
  onSignIn() {
    this.isLoading = true;
    this.authService.login('/dashboard');
  }

  /**
   * Sign in with Google via Zitadel
   */
  onGoogleSignIn() {
    this.isLoading = true;
    // Zitadel handles social login - just redirect to Zitadel
    this.authService.login('/dashboard');
  }

  /**
   * Sign in with X/Twitter via Zitadel
   */
  onXSignIn() {
    this.isLoading = true;
    // Zitadel handles social login - just redirect to Zitadel
    this.authService.login('/dashboard');
  }
}
