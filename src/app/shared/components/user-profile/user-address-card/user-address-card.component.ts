import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { LabelComponent } from '../../form/label/label.component';
import { ModalComponent } from '../../ui/modal/modal.component';
import { UserDetailsService, UserDetails } from '../../../services/user-details.service';

@Component({
  selector: 'app-user-address-card',
  imports: [
    CommonModule,
    InputFieldComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent,
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
        this.userDetails = details;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user details:', error);
        this.isLoading = false;
      }
    });
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  handleSave() {
    this.isSaving = true;
    this.userDetailsService.updateUserDetails(this.userDetails).subscribe({
      next: (updatedDetails) => {
        this.userDetails = updatedDetails;
        this.isSaving = false;
        this.closeModal();
        console.log('User details updated successfully');
      },
      error: (error) => {
        console.error('Error updating user details:', error);
        this.isSaving = false;
      }
    });
  }
}
