import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';

@Component({
  selector: 'app-habout',
  templateUrl: './habout.component.html',
  styleUrls: ['./habout.component.css']
})
export class HaboutComponent implements OnInit {

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }

  // About img
  aboutimg1 = 'assets/img/feature/aboutImg1.jpg';
  // aboutimg2 = 'assets/img/feature/aboutImg3.jpg';
  aboutimg2 = 'assets/img/bg/nodes.webp';
  // aboutbottomimg = 'assets/img/bg/bottomAboutImg.webp';
  // aboutbottomimg = 'assets/img/bg/sky.webp';
  aboutbottomimg = 'assets/img/bg/dc1.png';
  ngOnInit(): void {
  }

}
