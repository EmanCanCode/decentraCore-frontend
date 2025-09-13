import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { AlertService } from 'src/app/services/alert/alert.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  name: string = "";
  email: string = "";
  phone: string = "";
  subject: string = "";
  message: string = "";
  constructor(private alert: AlertService) { }

  ngOnInit(): void { }


  async submitContact() {
    if (
      !this.name ||
      !this.email ||
      !this.phone ||
      !this.subject ||
      !this.message
    ) {
      console.log("Missing data to submit contact form");
      await this.alert.fire(
        'error',
        'Error',
        'Please fill in all fields before submitting the contact form.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      console.log("Invalid email format");
      await this.alert.fire(
        'error',
        'Error',
        'Please enter a valid email address to submit the contact form.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

    // Optional: basic phone number pattern (only digits, optional +, spaces, dashes)
    const phoneRegex = /^[\d+\-\s]{7,20}$/;
    if (!phoneRegex.test(this.phone)) {
      console.log("Invalid phone number format");
      await this.alert.fire(
        'error',
        'Error',
        'Please enter a valid phone number to submit the contact form.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      message: this.message
    };
    $.ajax({
      url: `${environment.api}/api/contact`,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: async () => {
        await this.alert.fire(
          'success',
          'Success',
          'Thank you for contacting me! I will get back to you shortly.',
          {
            confirmButtonText: 'Got it!',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
        console.log("Successfully submitted contact form");
        this.name = ""; // Clear the name input field
        this.email = ""; // Clear the email input field
        this.phone = ""; // Clear the phone input field
        this.subject = ""; // Clear the subject input field
        this.message = ""; // Clear the message input field
      },
      error: async () => {
        console.log("Error submitting contact form");
        await this.alert.fire(
          'error',
          'Error',
          'There was an error submitting the contact form. Please try again later.',
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
      }
    });
  }

}
