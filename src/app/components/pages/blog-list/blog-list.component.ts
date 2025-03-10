import { Component, OnInit } from '@angular/core';

@Component({ 
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {

  constructor() { }
  // blog img
  img1 = 'assets/img/blog/01.jpg';
  img2 = 'assets/img/blog/02.jpg';
  img3 = 'assets/img/blog/03.jpg';
  img4 = 'assets/img/blog/06.jpg';
  author = 'assets/img/author-small.png';
  ngOnInit(): void {
  }

}
