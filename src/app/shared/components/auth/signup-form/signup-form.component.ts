import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UserCreate } from '../auth.service';

@Component({
  selector: 'app-signup-form',
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {
  showPassword = false;
  isChecked = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  fname = '';
  lname = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one digit' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    return { valid: true, message: '' };
  }

  onSignUp() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate inputs
    if (!this.fname || !this.lname || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Password validation
    const passwordValidation = this.validatePassword(this.password);
    if (!passwordValidation.valid) {
      this.errorMessage = passwordValidation.message;
      return;
    }

    // Check terms acceptance
    if (!this.isChecked) {
      this.errorMessage = 'Please accept the Terms and Conditions';
      return;
    }

    this.isLoading = true;

    const userData: UserCreate = {
      email: this.email,
      password: this.password,
      first_name: this.fname,
      last_name: this.lname,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting to sign in...';
        
        // Redirect to sign in page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.isLoading = false;

        // Handle different error scenarios
        if (error.status === 400) {
          this.errorMessage = error.error?.detail || 'Email already exists or invalid data';
        } else if (error.status === 422) {
          // Validation error
          const validationErrors = error.error?.detail;
          if (Array.isArray(validationErrors)) {
            this.errorMessage = validationErrors.map((e: any) => e.msg).join(', ');
          } else {
            this.errorMessage = 'Invalid input data';
          }
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    });
  }

  clearError() {
    this.errorMessage = '';
  }
}
