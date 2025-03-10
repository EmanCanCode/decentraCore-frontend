import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
  selector: 'app-mobilemenu',
  templateUrl: './mobilemenu.component.html',
  styleUrls: ['./mobilemenu.component.css']
})
export class MobilemenuComponent implements OnInit {

  constructor() { }

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

}
