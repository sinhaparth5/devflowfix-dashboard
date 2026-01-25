import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../../shared/services/seo.service';
import { PublicNavbarComponent } from '../../../shared/components/public-layout/public-navbar.component';
import { PublicFooterComponent } from '../../../shared/components/public-layout/public-footer.component';
import { ScrollAnimateDirective } from '../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule, FormsModule, PublicNavbarComponent, PublicFooterComponent, ScrollAnimateDirective],
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
      title: 'Contact Us | DevFlowFix - Sales, Support & Partnerships',
      description: 'Get in touch with DevFlowFix. Contact our team for sales inquiries, technical support, enterprise solutions, or partnership opportunities. Response within 24 hours.',
      keywords: 'contact devflowfix, devflowfix support, deployment tool help, CI/CD support, DevOps consultation, enterprise sales, technical support',
      url: '/contact',
      type: 'website',
      robots: 'index, follow'
    });

    this.seoService.addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/contact' }
    ]);

    // Add ContactPage schema for better SEO
    this.seoService.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact DevFlowFix',
      'description': 'Get in touch with our team for support and inquiries',
      'url': 'https://devflowfix.com/contact',
      'mainEntity': {
        '@type': 'Organization',
        'name': 'DevFlowFix',
        'email': 'hello@devflowfix.com',
        'contactPoint': [
          {
            '@type': 'ContactPoint',
            'contactType': 'sales',
            'email': 'hello@devflowfix.com',
            'availableLanguage': 'English'
          },
          {
            '@type': 'ContactPoint',
            'contactType': 'technical support',
            'email': 'enterprise@devflowfix.com',
            'availableLanguage': 'English'
          }
        ]
      }
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
