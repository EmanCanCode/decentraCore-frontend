import { Component, AfterViewInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow'; 
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }
  // Video bg
  videobg = 'assets/img/text-block/04.jpg';
  // Features
  featuresposts = [
    {icon:'flaticon-ring',title:'Diamond Ring',animationtime:'.3s'},
    {icon:'flaticon-bracelet',title:'Bracelets',animationtime:'.4s'},
    {icon:'flaticon-necklace',title:'Necklaces',animationtime:'.5s'},
    {icon:'flaticon-bracelet-2',title:'Pendants',animationtime:'.6s'},
    {icon:'flaticon-earrings',title:'Earrings',animationtime:'.7s'},
  ];
  // ABout img
  aboutimg = 'assets/img/text-block/05.jpg';
  // COunter
  counterposts = [
    {icon:'flaticon-user-1',number:'8000',title:'Happy Users'},
    {icon:'flaticon-like',number:'10',prefix:'M',title:'Reviews & Appriciate'},
    {icon:'flaticon-suitcase',number:'100',title:'Country Coverage'},
  ];
  // Galklery
  gallimg1 = 'assets/img/gallery/09.jpg';
  gallimg2 = 'assets/img/gallery/10.jpg';
  // Blog 
  latestpostConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    "arrows": true,
    "dots": false,
    "prevArrow": '.latest-post-arrow .prev-arrow',
    "nextArrow": '.latest-post-arrow .next-arrow',
    "responsive": [{
      "breakpoint": 992,
      "settings": {
        "slidesToShow": 2,
      },
    },
    {
      "breakpoint": 576,
      "settings": {
        "slidesToShow": 1,
      },
    },
    ],
  };
  blogposts = [ 
    {img:'assets/img/latest-post/01.jpg',title:'New Retro Collection of Pendants and Ring sets.',postdate:'28th Aug 2020',authorname:'Admin',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.'},
    {img:'assets/img/latest-post/02.jpg',title:'Special Wedding Rings Sets for Him and for Her.',postdate:'28th Aug 2020',authorname:'Admin',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.'},
    {img:'assets/img/latest-post/03.jpg',title:'Matching Jewellery Sets with your Outwear.',postdate:'28th Aug 2020',authorname:'Admin',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.'},
  ];

  ngAfterViewInit(): void {
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
     // Video popup
     ($('.popup-video') as any).magnificPopup({
      type: 'iframe',
    });
  }

}
