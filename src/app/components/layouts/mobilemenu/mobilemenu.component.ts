import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.css']
})
export class MobilemenuComponent implements OnInit {

  constructor(private web3: Web3Service, private alert: AlertService) { }

  ngOnInit(): void {
    function mobilemenu() {
      $(".sigma-hamburger-menu").on('click', function () {
        $(".sigma-menu-btn").toggleClass("active");
        $(".sigma-mobile-menu").toggleClass("active");
      });
      $('.menu-item-has-children>a').on('click', function (e) {
        e.preventDefault();
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
          element.removeClass('open');
          element.find('li').removeClass('open');
          element.find('ul').slideUp();
        } else {
          element.addClass('open');
          element.children('ul').slideDown();
          element.siblings('li').children('ul').slideUp();
          element.siblings('li').removeClass('open');
          element.siblings('li').find('li').removeClass('open');
          element.siblings('li').find('ul').slideUp();
        }
      });
    }
    mobilemenu()
  }

  async connect() {
    try {
      console.log("Connecting to wallet...");
      if (!this.web3.isWalletConnected()) await this.web3.connect();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      await this.alert.fire(
        'error',
        'Connection Error',
        'There was an error connecting to your wallet. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      )
    }
  }
}
