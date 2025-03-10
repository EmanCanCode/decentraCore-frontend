import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor() { }
  // Increment decrement
  public cartlist = [];

  increment(cartlist) {
    cartlist.qty += 1;
  }
  decrement(cartlist) {
    cartlist.qty -= 1;
  }
  // Cart list
  cartlistpost = [
    {img:'assets/img/shop/cart-1.png',title:'Blue Blast',total:109, qty:1},
    {img:'assets/img/shop/cart-2.png',title:"Florida's Finest",total:44, qty:1},
  ];

  ngOnInit(): void {
  }

}
