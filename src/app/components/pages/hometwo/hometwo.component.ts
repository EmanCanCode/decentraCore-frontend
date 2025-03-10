import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-hometwo',
  templateUrl: './hometwo.component.html',
  styleUrls: ['./hometwo.component.css']
})
export class HometwoComponent implements OnInit {

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }
  // Banner
  bannersliderConfig = {
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 5000,
    "dots": false,
    "fade": true,
    "arrows": false,
  };
  bannerposts = [
    { img: 'assets/img/banner/04.jpg', tag: 'Jewels That Define You', title: "The Perfect Jewels For You ", btn1: 'explore more', btn2: 'Buy Now' },
    { img: 'assets/img/banner/05.jpg', tag: 'Best summer sale is here', title: 'New Design Ring For You', btn1: 'explore more', btn2: 'Buy Now' },
  ];
  // condo posts
  condoposts = [
    { img: 'assets/img/we-offer/01.jpg', icon: 'flaticon-ring', title: 'New Rings', text: 'Get your wedding ring for him or her' },
    { img: 'assets/img/we-offer/02.jpg', icon: 'flaticon-bracelet-2', title: 'Copper Bangle', text: 'We have modern design bracelet , get now' },
    { img: 'assets/img/we-offer/03.jpg', icon: 'flaticon-necklace', title: 'Big Necklace', text: 'It is new trend in in jewels' },
    { img: 'assets/img/we-offer/04.jpg', icon: 'flaticon-diamond', title: 'Crystal Jewelry', text: 'Jewels that define your style' },
  ];
  // Category box
  catimg1 = 'assets/img/others/pr-1.png';
  catimg2 = 'assets/img/others/pr-2.png';
  catimg3 = 'assets/img/others/pr-3.png';
  catimg4 = 'assets/img/others/pr-4.png';
  // Video img
  videobg = 'assets/img/bg/05.jpg';
  videoicon = 'assets/img/icon/07.png';
  // Tabs img
  tbimg4 = 'assets/img/room-type/04.jpg';
  tbimg1 = 'assets/img/room-type/01.jpg';
  tbimg2 = 'assets/img/room-type/02.jpg';
  tbimg3 = 'assets/img/room-type/03.jpg';
  // Feature img
  feaimg1 = 'assets/img/feature/01.jpg';
  feaimg2 = 'assets/img/feature/02.jpg';
  feaimg3 = 'assets/img/feature/03.jpg';
  // handpickproducts 
  pickproducts = [
    { icon: 'flaticon-earrings', title: 'Artifical Earings', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet' },
    { icon: 'flaticon-bracelet', title: 'Bracelet Curb', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet' },
    { icon: 'flaticon-bracelet-1', title: 'Azrouel Variable', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet' },
    { icon: 'flaticon-bracelet-2', title: 'Ankle Bracelet', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet' },
    { icon: 'flaticon-ring', title: 'Pointer Ring', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet' },
    { icon: 'flaticon-necklace', title: 'Copper Necklace', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet' },
  ];
  // Room slider One
  roomslideroneConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    "arrows": false,
    "dots": false,
    "centerMode": true,
    "centerPadding": '6%',
    "responsive": [{
      "breakpoint": 1600,
      "settings": {
        "slidesToShow": 2,
      },
    },
    {
      "breakpoint": 992,
      "settings": {
        "slidesToShow": 1,
        "centerPadding": '15%',
      },
    },
    ],
  };
  roomslideroneposts = [
    { img: 'assets/img/room-slider/01.jpg' },
    { img: 'assets/img/room-slider/02.jpg' },
    { img: 'assets/img/room-slider/03.jpg' },
    { img: 'assets/img/room-slider/04.jpg' },
    { img: 'assets/img/room-slider/05.jpg' },
  ];
  // Room slider content
  roomslidercontentConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    "arrows": false,
    "dots": true,
  };
  roomslidercontentposts = [
    { icon: 'flaticon-necklace', title: 'Gold Neckless', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { icon: 'flaticon-ring', title: 'Diamond Ring', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { icon: 'flaticon-bracelet-2', title: 'Silver Bracelet', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { icon: 'flaticon-necklace', title: 'Diamond Necklace', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
    { icon: 'flaticon-earrings', title: 'Gold Earrings', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.' },
  ];


  ngOnInit(): void {

    // Video popup
    ($('.popup-video') as any).magnificPopup({
      type: 'iframe',
    });
  }

}
