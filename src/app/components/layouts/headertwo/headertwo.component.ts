import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import $ from 'jquery'

@Component({
  selector: 'app-headertwo',
  templateUrl: './headertwo.component.html',
  styleUrls: ['./headertwo.component.css']
})
export class HeadertwoComponent implements OnInit {

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
