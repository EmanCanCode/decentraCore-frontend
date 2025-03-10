import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor() { }
  // Team grid
  teamgridposts = [
    {img:'assets/img/team/01.jpg',name:'Rosa D.William',designation:'Founder & CEO'},
    {img:'assets/img/team/02.jpg',name:'hilixer b. browni',designation:'co-founder'},
    {img:'assets/img/team/03.jpg',name:'pokoloko k. kilix',designation:'consultant'},
    {img:'assets/img/team/04.jpg',name:'pokoloko k. kilix',designation:'consultant'},
    {img:'assets/img/team/05.jpg',name:'pokoloko k. kilix',designation:'consultant'},
    {img:'assets/img/team/01.jpg',name:'Rosa D.William',designation:'Founder & CEO'},
  ];
  ngOnInit(): void {
  }

}
