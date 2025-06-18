import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogsidebar',
  templateUrl: './blogsidebar.component.html',
  styleUrls: ['./blogsidebar.component.css']
})
export class BlogsidebarComponent implements OnInit {

  constructor() { }
  authorimg = 'assets/img/banner/headshot2.jpg';

  ngOnInit(): void {
  }

}
