import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import $ from 'jquery';


@Component({
  selector: 'app-footerthree',
  templateUrl: './footerthree.component.html',
  styleUrls: ['./footerthree.component.css']
})
export class FooterthreeComponent implements OnInit {
  email: string = "";
  constructor() { }

  ngOnInit(): void {
  }

  subscribeEmail() {
    console.log({ email: this.email });
    if (!this.email) {
      console.log("No email entered to subscribe");
      alert("Enter valid email to subscribe");
      return;
    }

    const data = { email: this.email };
    $.ajax({
      url: `${environment.api}/api/subscribe`,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: () => {
        console.log("Successfully subscribed email");
        this.email = ""; // Clear the email input field
      },
      error: () => {
        console.log("Error suscribing email");
        alert('Error suscribing email');
      }
    });
  }

}
