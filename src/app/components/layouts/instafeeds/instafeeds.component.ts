import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instafeeds',
  templateUrl: './instafeeds.component.html',
  styleUrls: ['./instafeeds.component.css']
})
export class InstafeedsComponent implements OnInit {

  constructor() { }
  instagramsliderConfig = {
    "slidesToShow": 6,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000,
    "arrows": false,
    "dots": false,
    "responsive": [{
      "breakpoint": 992,
      "settings": {
        "slidesToShow": 4,
      },
    },
    {
      "breakpoint": 768,
      "settings": {
        "slidesToShow": 3,
      },
    },
    {
      "breakpoint": 576,
      "settings": {
        "slidesToShow": 2,
      },
    },
    ],
  };
  instaposts = [
    { img: 'assets/img/instagram/01.jpg' },
    { img: 'assets/img/instagram/02.jpg' },
    { img: 'assets/img/instagram/03.jpg' },
    { img: 'assets/img/instagram/04.jpg' },
    { img: 'assets/img/instagram/05.jpg' },
    { img: 'assets/img/instagram/06.jpg' },
    { img: 'assets/img/instagram/01.jpg' },
    { img: 'assets/img/instagram/02.jpg' },
    { img: 'assets/img/instagram/03.jpg' },
    { img: 'assets/img/instagram/04.jpg' },
    { img: 'assets/img/instagram/05.jpg' },
    { img: 'assets/img/instagram/06.jpg' },
  ];
  ngOnInit(): void {
    
  }

}
