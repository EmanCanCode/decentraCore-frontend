import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ourproducts',
  templateUrl: './ourproducts.component.html',
  styleUrls: ['./ourproducts.component.css']
})
export class OurproductsComponent implements OnInit {

  constructor() { }
  
  // Featurepost
  featureposts = [
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Ankle Bracelet', price1: '$390', price2: '$480' },
    { img: 'assets/img/shop/02.jpg', tag1: 'New', title: 'Stud Earrings', price1: '$290' },
    { img: 'assets/img/shop/03.jpg', tag1: 'Sale', tag2: '-10%', title: 'Crumpled Ring', price1: '$450', price2: '$510' },
    { img: 'assets/img/shop/04.jpg', tag1: 'Sale', tag2: '-25%', title: 'Moon Necklace', price1: '$500', price2: '$580' },
  ];

  ngOnInit(): void {
  }

}
