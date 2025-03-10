import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow'; 
import $ from 'jquery';
import 'magnific-popup';

@Component({
  selector: 'app-gallerytwo',
  templateUrl: './gallerytwo.component.html',
  styleUrls: ['./gallerytwo.component.css']
})
export class GallerytwoComponent implements OnInit {

  constructor(private wowService: NgwWowService) {
    this.wowService.init();
  }
  // Gallery posts
  galleryposts = [
    {img:'assets/img/gallery/01.jpg'},
    {img:'assets/img/gallery/02.jpg'},
    {img:'assets/img/gallery/12.jpg'},
    {img:'assets/img/gallery/04.jpg'},
    {img:'assets/img/gallery/05.jpg'},
    {img:'assets/img/gallery/13.jpg'},
    {img:'assets/img/gallery/07.jpg'},
    {img:'assets/img/gallery/08.jpg'},
    {img:'assets/img/gallery/11.jpg'},
  ];
  ngOnInit(): void {
    $(document).ready(function() {
      ($('.popup-image') as any).magnificPopup({type:'image', enabled: true, mainClass: 'mfp-fade'});
    });
  }

}
