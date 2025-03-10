import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-latestpro',
  templateUrl: './latestpro.component.html',
  styleUrls: ['./latestpro.component.css']
})
export class LatestproComponent implements OnInit {

  constructor(){}
 // Shop latest product
 shoplatestsliderConfig = {
  "slidesToShow": 4,
  "slidesToScroll": 1,
  "fade": false,
  "infinite": true,
  "autoplay": true,
  "autoplaySpeed": 4000,
  "arrows": true,
  "dots": false,
  "prevArrow": '.shop-post-arrow .prev-arrow',
  "nextArrow": '.shop-post-arrow .next-arrow',
  "responsive": [{
    "breakpoint": 992,
    "settings": {
      "slidesToShow": 3,
    },
  },
  {
    "breakpoint": 767,
    "settings": {
      "slidesToShow": 1,
    },
  },
  ],
};
shoplatestposts = [
  { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Ankle Bracelet', price1: '$390', price2: '$480' },
  { img: 'assets/img/shop/02.jpg', tag1: 'New', title: 'Stud Earrings', price1: '$290' },
  { img: 'assets/img/shop/03.jpg', tag1: 'New', tag2: '-10%', title: 'Crumpled Ring', price1: '$450', price2: '$510' },
  { img: 'assets/img/shop/04.jpg', tag1: 'Sale', tag2: '-25%', title: 'Moon Necklace', price1: '$500', price2: '$580' },
  { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Ankle Bracelet', price1: '$390', price2: '$480' },
  { img: 'assets/img/shop/02.jpg', tag1: 'New', title: 'Stud Earrings', price1: '$290' },
  { img: 'assets/img/shop/03.jpg', tag1: 'New', tag2: '-10%', title: 'Crumpled Ring', price1: '$450', price2: '$510' },
  { img: 'assets/img/shop/04.jpg', tag1: 'Sale', tag2: '-25%', title: 'Moon Necklace', price1: '$500', price2: '$580' },
];
  ngOnInit(): void {
  }

}
