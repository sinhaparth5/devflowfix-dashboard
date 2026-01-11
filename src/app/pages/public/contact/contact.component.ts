import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule, FormsModule, PublicNavbarComponent, PublicFooterComponent],
  templateUrl: './contact.component.html',
  styles: ``
})
export class ContactComponent implements OnInit {

  contactForm = {
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  };

  subjects = [
    'General Inquiry',
    'Sales Question',
    'Technical Support',
    'Partnership Opportunity',
    'Press & Media',
    'Other'
  ];

  isSubmitting = false;
  submitted = false;

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSEO({
      title: 'Contact Us | DevFlowFix - Get in Touch',
      description: 'Contact the DevFlowFix team for sales inquiries, technical support, or partnership opportunities. We\'re here to help you succeed.',
      keywords: 'contact devflowfix, devflowfix support, deployment tool help, CI/CD support, DevOps consultation',
      url: '/contact',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/contact' }
    ]);

    this.seoService.addWebPageSchema({
      name: 'Contact DevFlowFix',
      description: 'Get in touch with our team for support and inquiries',
      url: '/contact'
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    // Simulate form submission
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitted = true;
      this.contactForm = {
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      };
    }, 1500);
  }
}
