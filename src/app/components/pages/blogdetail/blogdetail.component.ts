import { Component, OnInit } from '@angular/core';
import { PrismRehighlightService } from 'src/app/services/prism/prism.service';
import Prism from 'src/app/prism-setup';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.css']
})
export class BlogdetailComponent implements OnInit {

  constructor(
    private _prism: PrismRehighlightService,
    private alertService: AlertService
  ) { }
  blogauthor = 'assets/img/banner/headshot2.jpg';

  relatedtags = [
    { tag: 'EmanCanCode' },
    { tag: 'Blockchain' },
    { tag: 'Web3' },
  ];

  blogsocials = [
    { icon: 'fa-medium', url: 'https://medium.com/@emancancode' },
    { icon: 'fa-linkedin', url: 'https://www.linkedin.com/in/emmanuel-douge-b26938227/' },
    { icon: 'fa-github', url: 'https://github.com/EmanCanCode' },
  ];
  async ngOnInit() {
    // make wait 0.5 seconds
    // await new Promise(resolve => setTimeout(resolve, 500));
    (Prism as any).highlightAll?.();
    this.alertService.notifyFirstVisit(
      "blog",
      "Welcome to the Blog!",
      "Check out the latest articles and insights on blockchain and Web3. If the code snippets don't look right, please refresh the page. Enjoy your stay!",
      { timer: 5000, timerProgressBar: true, }
    )
  }

}
