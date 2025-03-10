import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shoprighttwo',
  templateUrl: './shoprighttwo.component.html',
  styleUrls: ['./shoprighttwo.component.css']
})
export class ShoprighttwoComponent implements OnInit {

  constructor() { }
  // Shop grid
  shopgridpost = [
    {img:'assets/img/shop/01.jpg',title:'Ankle Bracelet',tag:'15% Off',price:'390',discountprice:'480'},
    {img:'assets/img/shop/02.jpg',title:'Stud Earrings',tag:'10% Off',price:'290',discountprice:'300'},
    {img:'assets/img/shop/03.jpg',title:'Crumpled Ring',tag:'New',price:'450',discountprice:'510'},

    {img:'assets/img/shop/01.jpg',title:'Golden Pendant',tag:'20% Off',price:'780',discountprice:'800'},
    {img:'assets/img/shop/02.jpg',title:'Silver Pendant.',price:'290',discountprice:'300'},
    {img:'assets/img/shop/03.jpg',title:'Diamond Ring.',tag:'10% Off',price:'890',discountprice:'900'},

    {img:'assets/img/shop/01.jpg',title:'Stud Earrings',tag:'15% Off',price:'580',discountprice:'630'},
    {img:'assets/img/shop/02.jpg',title:'Ankle Bracelet',tag:'10% Off',price:'290',discountprice:'300'},
    {img:'assets/img/shop/03.jpg',title:'Diamond Ring.',tag:'New',price:'800',discountprice:'920'},

    {img:'assets/img/shop/01.jpg',title:'Ankle Bracelet',price:'390',discountprice:'480'},
    {img:'assets/img/shop/02.jpg',title:'Stud Earrings',tag:'25% Off',price:'290',discountprice:'300'},
    {img:'assets/img/shop/03.jpg',title:'Crumpled Ring',tag:'15% Off',price:'450',discountprice:'510'},
  ];

  ngOnInit(): void {
  }

}
