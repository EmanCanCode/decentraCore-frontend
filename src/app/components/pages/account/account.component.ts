import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor() { }
  orderlists = [
    {img:'assets/img/shop/cart-1.png',title:'Product1',id:'b123jhk4h',date:'12-Sep-2020'},
    {img:'assets/img/shop/cart-2.png',title:'Product2',id:'b673juyk4h',date:'14-Sep-2020'},
    {img:'assets/img/shop/cart-3.png',title:'Product3',id:'Q123jh4h',date:'12-Sep-2020'},
    {img:'assets/img/shop/cart-1.png',title:'Product4',id:'R444lo98',date:'20-Sep-2020'},
  ];

  ngOnInit(): void {
  }

}
