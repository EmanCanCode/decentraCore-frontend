import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor() { }
  // Popular feeds
  popularfeeds = [
    {img:'assets/img/recent-post-wid/04.png',title:'How Are Colored Diamonds Formed?',postdate:'24th March 2020'},
    {img:'assets/img/recent-post-wid/05.png',title:'How Are Colored Diamonds Formed?',postdate:'24th March 2020'},
    {img:'assets/img/recent-post-wid/06.png',title:'How Are Colored Diamonds Formed?',postdate:'24th March 2020'},
  ];

  ngOnInit(): void {
  }

}
