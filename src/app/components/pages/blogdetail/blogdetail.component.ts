import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.css']
})
export class BlogdetailComponent implements OnInit {

  constructor() { }
  blogimg = 'assets/img/blog-details/01.jpg';
  blogauthor = 'assets/img/blog-details/02.jpg';

  relatedtags = [
    {tag:'Rings'},
    {tag:'desgin'},
    {tag:'necklace'},
  ];

  blogsocials = [
    {icon:'fa-facebook-f',url:'#'},
    {icon:'fa-twitter',url:'#'},
    {icon:'fa-medium',url:'#'},
    {icon:'fa-google-plus-g',url:'#'},
    {icon:'fa-tumblr',url:'#'},
  ];

  blogicon = 'assets/img/blog-details/icon.png';

  relatedposts = [
    {img:'assets/img/blog-details/03.jpg',title:'Non-Diamond Gemstones for Engagement Rings',text:'Lorem ipsum dolor sit amet, conse ctet ur adipisicing elit, sed doing.',postdate:'24th March 2020'},
    {img:'assets/img/blog-details/04.jpg',title:'Non-Diamond Gemstones for Engagement Rings',text:'Lorem ipsum dolor sit amet, conse ctet ur adipisicing elit, sed doing.',postdate:'24th March 2020'},
  ];

  authorimg = "assets/img/blog-details/author.jpg";

  commentuser1 = 'assets/img/blog-details/avatar-1.jpg';
  commentuser2 = 'assets/img/blog-details/avatar-2.jpg';
  commentuser3 = 'assets/img/blog-details/avatar-3.jpg';

  ngOnInit(): void {
  }

}
