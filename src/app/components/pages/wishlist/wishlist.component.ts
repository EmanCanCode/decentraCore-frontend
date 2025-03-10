import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  constructor() { }
  // Wishlist table
  wishlistposts = [
    {img:'assets/img/shop/cart-1.png',name:'Product1',price:'109',instock:'In Stock',total:'320'},
    {img:'assets/img/shop/cart-2.png',name:'Product2',price:'109',outstock:'Out Of Stock',total:'320'},
    {img:'assets/img/shop/cart-3.png',name:'Product3',price:'109',outstock:'Out Of Stock',total:'320'},
    {img:'assets/img/shop/cart-4.png',name:'Product4',price:'109',instock:'In Stock',total:'320'},
    {img:'assets/img/shop/cart-5.png',name:'Product5',price:'109',instock:'In Stock',total:'320'},
  ];

  ngOnInit(): void {
  }

}
