import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bloggridsidebar',
  templateUrl: './bloggridsidebar.component.html',
  styleUrls: ['./bloggridsidebar.component.css']
})
export class BloggridsidebarComponent implements OnInit {

  constructor() { }

  bloggridposts = [
    {img:'assets/img/latest-post/01.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/02.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/03.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/04.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/05.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/06.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/01.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/02.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/03.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/04.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/05.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/06.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/01.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
    {img:'assets/img/latest-post/02.jpg',title:'We provide you with top notch Jewelry Products',postdate:'28th Aug 2020',text:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.',author:'Admin'},
  ];

  ngOnInit(): void {
  }

}
