import {Component,ViewChild,AfterViewInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements AfterViewInit {
  closeResult: string;
  @ViewChild('content') content;
  constructor(private modalService: NgbModal) {}

  ngAfterViewInit() {
    this.openModal();
  }
  openModal(){
    this.modalService.open(this.content, { centered: true });
  }
  // popupimg
  popupimg = 'assets/img/popup.jpg';

}
