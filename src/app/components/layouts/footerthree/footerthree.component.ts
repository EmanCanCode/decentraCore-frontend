import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import $ from 'jquery';
import { AlertService } from 'src/app/services/alert/alert.service';


@Component({
  selector: 'app-footerthree',
  templateUrl: './footerthree.component.html',
  styleUrls: ['./footerthree.component.css']
})
export class FooterthreeComponent implements OnInit {
  email: string = "";
  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
  }

  async subscribeEmail() {
    console.log({ email: this.email });
    if (!this.email) {
      console.log("No email entered to subscribe");
      await this.alertService.fire(
        'warning',
        'Invalid Email. No email provided',
        'Please try again or contact support if the issue persists.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

    const data = { email: this.email };
    $.ajax({
      url: `${environment.api}/api/subscribe`,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: async () => {
        await this.alertService.fire(
          'success',
          'Successfully subscribed email',
          "Thank you for subscribing!",
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );

        console.log("Successfully subscribed email");
        this.email = ""; // Clear the email input field
      },
      error: async () => {
        console.log("Error suscribing email");
        await this.alertService.fire(
          'error',
          "Error subscribing",
          'Please try again or contact support if the issue persists.',
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        )
      }
    });
  }

}
