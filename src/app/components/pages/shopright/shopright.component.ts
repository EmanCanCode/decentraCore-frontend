import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopright',
  templateUrl: './shopright.component.html',
  styleUrls: ['./shopright.component.css']
})
export class ShoprightComponent implements OnInit {

  constructor() { }
  // Shop grid
   
  shopgridpost = [
    {img:'assets/img/shop/01.jpg',title:'Ankle Bracelet',tag:'Sale',tag1:'-15%',price:'390',discountprice:'480'},
    {img:'assets/img/shop/02.jpg',title:'Stud Earrings',tag:'New',price:'290',discountprice:'300'},
    {img:'assets/img/shop/03.jpg',title:'Crumpled Ring',tag:'New',tag1:'-10%',price:'450',discountprice:'510'},

    {img:'assets/img/shop/01.jpg',title:'Golden Pendant',tag:'Sale',tag1:'-15%',price:'780',discountprice:'800'},
    {img:'assets/img/shop/02.jpg',title:'Silver Pendant.',price:'290',discountprice:'300'},
    {img:'assets/img/shop/03.jpg',title:'Diamond Ring.',tag1:'-10%',price:'890',discountprice:'900'},

    {img:'assets/img/shop/01.jpg',title:'Stud Earrings',tag:'Sale',tag1:'-15%',price:'580',discountprice:'630'},
    {img:'assets/img/shop/02.jpg',title:'Ankle Bracelet',tag:'Sale',tag1:'-40%',price:'290',discountprice:'300'},
    {img:'assets/img/shop/03.jpg',title:'Diamond Ring.',tag1:'-10%',price:'800',discountprice:'920'},

    {img:'assets/img/shop/01.jpg',title:'Ankle Bracelet',tag:'Sale',tag1:'-15%',price:'390',discountprice:'480'},
    {img:'assets/img/shop/02.jpg',title:'Stud Earrings',tag:'New',price:'290',discountprice:'300'},
    {img:'assets/img/shop/03.jpg',title:'Crumpled Ring',tag:'New',tag1:'-10%',price:'450',discountprice:'510'},
  ];

  ngOnInit(): void {
  }

}
