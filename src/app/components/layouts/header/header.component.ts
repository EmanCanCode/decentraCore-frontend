import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import $ from 'jquery'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) { }
  // Sticky Nav
  @HostListener('window:scroll', [])
  onWindowScroll(event: Event) {
    //set up the div "id=nav"
    if (document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150) {
      document.getElementById('header').classList.add('sticky-active');
    }
    else {
      document.getElementById('header').classList.remove('sticky-active');
    }
  }
  opencanvas: boolean = true;
  cartbox: boolean = true;
  navopen: boolean = true;
  offCanvasBtn() {
    this.opencanvas = !this.opencanvas;
  }
  offCanvasclose() {
    this.opencanvas = !this.opencanvas;
  }
  cartbtn() {
    this.cartbox = !this.cartbox;
  }
  hamburgerbtn() {
    this.navopen = !this.navopen;
  }

  // Cart loop
  cartposts = [
    { img: 'assets/img/cart/1.jpg', title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: 'assets/img/cart/2.jpg', title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: 'assets/img/cart/3.jpg', title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
    { img: 'assets/img/cart/4.jpg', title: 'Oak Wood Cutting Board', price: '2x 10,000$' },
  ];

  ngOnInit(): void {
    function megamenu() {
      $('.sigm-megamenu-nav>li').on('mouseover', function (e) {
        e.preventDefault();

        $('.sub-menu .sigm-megamenu-nav').find('.active').removeClass('active');
        $('.sub-menu .tab-content').find('.active').removeClass('active show');

        $(this).find('a').addClass('active');
        $('.sub-menu .tab-item').eq($(this).index()).addClass('active show');

      });
    }
    megamenu()
  }

}
