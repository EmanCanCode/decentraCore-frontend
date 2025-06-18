import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.css']
})
export class BlogdetailComponent implements OnInit {

  constructor() { }
  blogauthor = 'assets/img/banner/headshot2.jpg';

  relatedtags = [
    {tag:'EmanCanCode'},
    {tag:'Blockchain'},
    {tag:'Web3'},
  ];

  blogsocials = [
    {icon:'fa-medium',url:'https://medium.com/@emancancode'},
    {icon:'fa-linkedin',url:'https://www.linkedin.com/in/emmanuel-douge-b26938227/'},
    {icon:'fa-github',url:'https://github.com/EmanCanCode'},
  ];
  async ngOnInit() {
    // make wait 0.5 seconds
    await new Promise(resolve => setTimeout(resolve, 500));
  }

}
