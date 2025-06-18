import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
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
  constructor() { }

  ngOnInit(): void {}


  submitContact() {
    if (
      !this.name ||
      !this.email ||
      !this.phone ||
      !this.subject ||
      !this.message
    ) {
      console.log("Missing data to submit contact form");
      alert("Enter valid data to submit contact form");
      return;
    }

      // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      console.log("Invalid email format");
      alert("Enter valid email to submit contact form");
      return;
    }

    // Optional: basic phone number pattern (only digits, optional +, spaces, dashes)
    const phoneRegex = /^[\d+\-\s]{7,20}$/;
    if (!phoneRegex.test(this.phone)) {
      console.log("Invalid phone number format");
      alert("Enter valid phone number to submit contact form");
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
      success: () => {
        console.log("Successfully submitted contact form");
        this.name = ""; // Clear the name input field
        this.email = ""; // Clear the email input field
        this.phone = ""; // Clear the phone input field
        this.subject = ""; // Clear the subject input field
        this.message = ""; // Clear the message input field
      },
      error: () => {
        console.log("Error submitting contact form");
        alert('Error submitting contact form');
      }
    });
  }

}
