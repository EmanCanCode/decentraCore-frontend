import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent implements OnInit {

  constructor() { }
  // Popular feeds
  popularfeeds = [
    {img:'assets/img/recent-post-wid/04.png',title:'How Are Colored Diamonds Formed?',postdate:'24th March 2020'},
    {img:'assets/img/recent-post-wid/05.png',title:'How Are Colored Diamonds Formed?',postdate:'24th March 2020'},
    {img:'assets/img/recent-post-wid/06.png',title:'How Are Colored Diamonds Formed?',postdate:'24th March 2020'},
  ];
  // Categories
  categories = [
    {title:'Bracelets',numberofpost:'26'},
    {title:'Rings',numberofpost:'26'},
    {title:'Silver Bracelet',numberofpost:'26'},
    {title:'Necklace',numberofpost:'26'},
    {title:'Earrings',numberofpost:'26'},
  ];

  ngOnInit(): void {
  }

}
