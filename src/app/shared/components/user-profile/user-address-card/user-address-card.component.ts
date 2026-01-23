import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';

import { InputFieldComponent } from '../../form/input/input-field.component';
import { LabelComponent } from '../../form/label/label.component';
import { ModalComponent } from '../../ui/modal/modal.component';
import { UserDetailsService, UserDetails } from '../../../services/user-details.service';

@Component({
  selector: 'app-user-address-card',
  imports: [
    FormsModule,
    InputFieldComponent,
    LabelComponent,
    ModalComponent
  ],
  templateUrl: './user-address-card.component.html',
  styles: ``
})
export class UserAddressCardComponent implements OnInit {

  constructor(
    public modal: ModalService,
    private userDetailsService: UserDetailsService
  ) {}

  isOpen = false;
  isLoading = false;
  isSaving = false;

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

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.isLoading = true;
    this.userDetailsService.getUserDetails().subscribe({
      next: (details) => {
        // Merge with existing data to preserve any fields
        this.userDetails = { ...this.userDetails, ...details };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.isLoading = false;
        // If error occurs, at least set loading to false
      }
    });
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  handleSave(event?: Event) {
    event?.preventDefault();
    this.isSaving = true;

    // Only send address fields
    const addressData: Partial<UserDetails> = {
      country: this.userDetails.country,
      city: this.userDetails.city,
      postal_code: this.userDetails.postal_code,
    };

    this.userDetailsService.updateUserDetails(addressData).subscribe({
      next: (updatedDetails) => {
        // Merge the response with existing data to preserve social links and other fields
        this.userDetails = { ...this.userDetails, ...updatedDetails };
        this.isSaving = false;
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating address:', error);
        this.isSaving = false;
      }
    });
  }
}
