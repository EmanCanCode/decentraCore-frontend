import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogposts',
  templateUrl: './blogposts.component.html',
  styleUrls: ['./blogposts.component.css']
})
export class BlogpostsComponent implements OnInit {

  constructor() { }
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
    {img:'assets/img/latest-post/01.jpg',title:'New Retro Collection of Pendants and Ring sets.',postdate:'28th Aug 2020',authorname:'Admin',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.'},
    {img:'assets/img/latest-post/02.jpg',title:'Special Wedding Rings Sets for Him and for Her.',postdate:'28th Aug 2020',authorname:'Admin',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.'},
    {img:'assets/img/latest-post/03.jpg',title:'Matching Jewellery Sets with your Outwear.',postdate:'28th Aug 2020',authorname:'Admin',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.'},
  ];

  ngOnInit(): void {
  }

}
