import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css']
})
export class ClassificationComponent implements OnInit {

  constructor() { }
  // Tabs
  earingposts = [
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Ankle Bracelet', price1: '$390', price2: '$480' },
    { img: 'assets/img/shop/02.jpg', tag1: 'New', title: 'Stud Earrings', price1: '$290', price2: '$300' },
    { img: 'assets/img/shop/03.jpg', tag1: 'New', tag2: '-10%', title: 'Crumpled Ring', price1: '$450', price2: '$510' },
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Golden Pendant', price1: '$780', price2: '$800' },
  ];

  ringsposts = [
    { img: 'assets/img/shop/03.jpg', tag2: '-10%', title: 'Diamond Ring.', price1: '$890', price2: '$900' },
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Stud Earrings ', price1: '$580', price2: '$630' },
    { img: 'assets/img/shop/02.jpg', tag1: 'Sale', tag2: '-40%', title: 'Ankle Bracelet', price1: '$290', price2: '$300' },
    { img: 'assets/img/shop/03.jpg', tag2: '-10%', title: 'Diamond Ring.', price1: '$890', price2: '$920' },
  ];

  necklessposts = [
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Ankle Bracelet', price1: '$390', price2: '$480' },
    { img: 'assets/img/shop/02.jpg', tag1: 'New', title: 'Stud Earrings', price1: '$290', price2: '$300' },
    { img: 'assets/img/shop/03.jpg', tag1: 'New', tag2: '-10%', title: 'Crumpled Ring', price1: '$450', price2: '$510' },
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Golden Pendant', price1: '$780', price2: '$800' },
  ];

  braceletposts = [
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Ankle Bracelet', price1: '$390', price2: '$480' },
    { img: 'assets/img/shop/02.jpg', tag1: 'New', title: 'Stud Earrings', price1: '$290', price2: '$300' },
    { img: 'assets/img/shop/03.jpg', tag1: 'New', tag2: '-10%', title: 'Crumpled Ring', price1: '$450', price2: '$510' },
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Golden Pendant', price1: '$780', price2: '$800' },
  ];
  armletsposts = [
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Ankle Bracelet', price1: '$390', price2: '$480' },
    { img: 'assets/img/shop/02.jpg', tag1: 'New', title: 'Stud Earrings', price1: '$290', price2: '$300' },
    { img: 'assets/img/shop/03.jpg', tag1: 'New', tag2: '-10%', title: 'Crumpled Ring', price1: '$450', price2: '$510' },
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Golden Pendant', price1: '$780', price2: '$800' },
  ];
  ankletsposts = [
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Ankle Bracelet', price1: '$390', price2: '$480' },
    { img: 'assets/img/shop/02.jpg', tag1: 'New', title: 'Stud Earrings', price1: '$290', price2: '$300' },
    { img: 'assets/img/shop/03.jpg', tag1: 'New', tag2: '-10%', title: 'Crumpled Ring', price1: '$450', price2: '$510' },
    { img: 'assets/img/shop/01.jpg', tag1: 'Sale', tag2: '-15%', title: 'Golden Pendant', price1: '$780', price2: '$800' },
  ];
  // Tresnding products
  trendingleftposts = [
    { img: 'assets/img/menu/01.jpg', title: 'Diamond Pendants', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.3s' },
    { img: 'assets/img/menu/02.jpg', title: 'Ankle Bracelet', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.4s' },
    { img: 'assets/img/menu/03.jpg', title: 'Stud Earrings', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.5s' },
    { img: 'assets/img/menu/04.jpg', title: 'Moon Necklace', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.6s' },
    { img: 'assets/img/menu/05.jpg', title: 'Stud Earrings', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.7s' },
  ];
  trendingrightposts = [
    { img: 'assets/img/menu/06.jpg', title: 'Diamond Ring', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.3s' },
    { img: 'assets/img/menu/07.jpg', title: 'Artifical Earings', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.4s' },
    { img: 'assets/img/menu/08.jpg', title: 'Bracelet Curb', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.5s' },
    { img: 'assets/img/menu/09.jpg', title: 'Azrouel Variable', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.6s' },
    { img: 'assets/img/menu/10.jpg', title: 'Azrouel Variable', text: 'Lorem ipsum dolor sit amet, consectetur adip isicing elit, sed do eiusmod tempor.', animationtime: '.7s' },
  ];
  ngOnInit(): void {
  }

}
