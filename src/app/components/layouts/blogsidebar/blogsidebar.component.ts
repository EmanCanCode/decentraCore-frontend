import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogsidebar',
  templateUrl: './blogsidebar.component.html',
  styleUrls: ['./blogsidebar.component.css']
}) 
export class BlogsidebarComponent implements OnInit {

  constructor() { }
  // Author img 
  authorimg = 'assets/img/author.png';
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
  // Twitter Feeds
  twitterfeeds = [
    {tweet:'Rescue - #Gutenberg ready @ wordpress Theme for Silver Bracelet Bloggers available on @ ThemeForest https://t.co/2r1POjOjgVC… https://t.co/rDAnPyClu1',tweetdate:'September 12, 2020'},
    {tweet:'Rescue - #Gutenberg ready @ wordpress Theme for Silver Bracelet Bloggers available on @ ThemeForest https://t.co/2r1POjOjgVC… https://t.co/rDAnPyClu1',tweetdate:'September 12, 2020'},
    {tweet:'Rescue - #Gutenberg ready @ wordpress Theme for Silver Bracelet Bloggers available on @ ThemeForest https://t.co/2r1POjOjgVC… https://t.co/rDAnPyClu1',tweetdate:'September 12, 2020'},
  ];
  // Instagram Feeds
  instafeeds = [
    {img:'assets/img/instagram-wid/01.jpg'},
    {img:'assets/img/instagram-wid/02.jpg'},
    {img:'assets/img/instagram-wid/03.jpg'},
    {img:'assets/img/instagram-wid/04.jpg'},
    {img:'assets/img/instagram-wid/05.jpg'},
    {img:'assets/img/instagram-wid/06.jpg'},
    {img:'assets/img/instagram-wid/07.jpg'},
    {img:'assets/img/instagram-wid/08.jpg'},
    {img:'assets/img/instagram-wid/09.jpg'},
  ];
  // Popular Tags
  tags = [
    {title:'Rings'},
    {title:'earrings'},
    {title:'necklace'},
    {title:'bracelets'},
    {title:'wedding ring'},
    {title:'bangles'},
    {title:'hard ring'},
    {title:'ankle bracelet'},
    {title:'silver bracelet'},
    {title:'earring'},
    {title:'copper bracelet'},
    {title:'tech'},
  ];
  // Adv
  advbanner= 'assets/img/banner-widget.jpg';
  ngOnInit(): void {
  }

}
