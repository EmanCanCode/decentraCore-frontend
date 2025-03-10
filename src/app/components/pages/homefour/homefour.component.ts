import { Component, AfterViewInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-homefour',
  templateUrl: './homefour.component.html',
  styleUrls: ['./homefour.component.css']
})
export class HomefourComponent implements AfterViewInit {

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }
  // Banner
  bannerimg = 'assets/img/banner/05.jpg';
  // About
  aboutimg1 = 'assets/img/bg/about-1.png';
  aboutimg2 = 'assets/img/bg/about-2.png';
  // Location posts
  locationposts = [
    { img: 'assets/img/location/1.jpg', title: 'NYC USA', text: '22 Dec - 25 Dec' },
    { img: 'assets/img/location/2.jpg', title: 'Paris France', text: '22 Dec - 25 Dec' },
    { img: 'assets/img/location/3.jpg', title: 'Florida USA', text: '22 Dec - 25 Dec' },
  ];
  // Counter
  counterposts = [
    { icon: 'flaticon-bracelet-1', number: '84', prefix: 'k', title: 'Jewelriess in Album' },
    { icon: 'flaticon-like', number: '10', prefix: 'M', title: 'Happy Feedbacks' },
    { icon: 'flaticon-earrings', number: '02', prefix: 'k', title: 'Categories Served' },
    { icon: 'flaticon-user-1', number: '100', prefix: 'M', title: 'Happy Clients' },
  ];
  // Video
  Videobg = 'assets/img/text-block/03.jpg';
  ngAfterViewInit(): void {
    // Video popup
    ($('.popup-video') as any).magnificPopup({
      type: 'iframe',
    });
    // Counter
    ($('.counter')as any).each(function () {
      ($(this)as any).prop('Counter', 0).animate({
        Counter: $(this).text()
      }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          ($(this)as any).text(Math.ceil(this.Counter));
        },
      });
    });
    // Parallax
    $(document).ready(function () {
      //parallax scroll
      $(window).on("scroll", function () {
        var parallaxElement = $(".parallax_scroll_up"),
          parallaxQuantity = parallaxElement.length;
        window.requestAnimationFrame(function () {
          for (var i = 0; i < parallaxQuantity; i++) {
            var currentElement = parallaxElement.eq(i),
              windowTop = $(window).scrollTop(),
              elementTop = currentElement.offset().top,
              elementHeight = currentElement.height(),
              viewPortHeight = window.innerHeight * 0.5 - elementHeight * 0.5,
              scrolled = windowTop - elementTop + viewPortHeight;
            currentElement.css({
              transform: "translate3d(0," + scrolled * -0.25 + "px, 0)"
            });
          }
        });
        var parallaxElement2 = $(".parallax_scroll_down"),
          parallaxQuantity2 = parallaxElement2.length;
        window.requestAnimationFrame(function () {
          for (var i = 0; i < parallaxQuantity2; i++) {
            var currentElement2 = parallaxElement2.eq(i),
              windowTop = $(window).scrollTop(),
              elementTop = currentElement2.offset().top,
              elementHeight = currentElement2.height(),
              viewPortHeight = window.innerHeight * 0.5 - elementHeight * 0.5,
              scrolled = windowTop - elementTop;
            currentElement2.css({
              transform: "translate3d(0," + scrolled * 0.05 + "px, 0)"
            });
          }
        });
      });
    });
  }

}
