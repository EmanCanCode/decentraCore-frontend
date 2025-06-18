import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  constructor(
    private web3service: Web3Service,
  ) { }

  ngOnInit(): void {
  }

  async connectWallet() {
    await this.web3service.detectWallet();
    await this.web3service.connect();
  }
}
