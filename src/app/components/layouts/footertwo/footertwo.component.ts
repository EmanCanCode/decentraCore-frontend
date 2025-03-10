import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footertwo',
  templateUrl: './footertwo.component.html',
  styleUrls: ['./footertwo.component.css']
})
export class FootertwoComponent implements OnInit {
  // logo
  logo = 'assets/img/footer-logo.png';
  constructor() { }

  ngOnInit(): void {
  }

}
