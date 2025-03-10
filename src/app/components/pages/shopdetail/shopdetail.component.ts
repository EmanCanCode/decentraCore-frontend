import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopdetail',
  templateUrl: './shopdetail.component.html',
  styleUrls: ['./shopdetail.component.css']
})
export class ShopdetailComponent implements OnInit {

  constructor() { }
  // Quantity 
  public counter: number = 1
  increment() {
    this.counter += 1;
  }
  decrement() {
    this.counter -= 1;
  }
  // Comments
  comment1 = 'assets/img/blog-details/avatar-1.jpg';
  comment2 = 'assets/img/blog-details/avatar-2.jpg';
  comment3 = 'assets/img/blog-details/avatar-3.jpg';
  // Detail slider
  detailsliderConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": false,
    "arrows": false,
    "dots": false,
  };
  detailslidertwoConfig = {
    "slidesToShow": 5,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": false,
    "arrows": false,
    "dots": false,
    "focusOnSelect": true,
    "responsive": [{
      "breakpoint": 768,
      "settings": {
        "slidesToShow": 4,
      }
    }],
  };

  bigsliderpost = [
    {img:'assets/img/shop/detail-1.png',tag:'Sale'},
    {img:'assets/img/shop/detail-2.png'},
    {img:'assets/img/shop/detail-2.png',tag:'Sale'},
    {img:'assets/img/shop/detail-2.png',tag:'Sale'},
    {img:'assets/img/shop/detail-1.png',tag:'Sale'},
  ];
  smallsliderpost = [
    {img:'assets/img/shop/s-1.png'},
    {img:'assets/img/shop/s-2.png'},
    {img:'assets/img/shop/s-3.png'},
    {img:'assets/img/shop/s-4.png'},
    {img:'assets/img/shop/s-1.png'},
    {img:'assets/img/shop/s-2.png'},
  ];

  ngOnInit(): void {
  }

}
