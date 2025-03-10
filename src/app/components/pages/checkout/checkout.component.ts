import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor() { }
  checkouttableposts = [
    {title:'Apples',piece:1, qty:1,total:32.00},
    {title:'Oranges',piece:1, qty:1,total:32.80},
    {title:'Mangoes',piece:1, qty:1,total:50.99},
  ];
  

  ngOnInit(): void {
  }

}
