import { Component, OnInit } from '@angular/core';
import { SupplyChainService } from '../../../../services/supplyChain/supply-chain.service';
import { ethers } from 'ethers';
import { Item } from 'src/app/interfaces/interfaces';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-supply-chain-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class SupplyChainShopComponent implements OnInit {
  inventoryManagementContract: ethers.Contract;

  shopGridPost = [
    {
      img:'assets/img/supplyChain/bearings.webp',
      title:'',
      tag:'Sale',
      price:'0.01',
      link: '../../supplyChain/view/1'
    },
    {
      img:'assets/img/supplyChain/wafer.webp',
      title:'',
      tag:'New',
      price:'0.02',
      link: '../../supplyChain/view/2'
    },
    {
      img:'assets/img/supplyChain/pellets.webp',
      title:'',
      tag:'New',
      price:'0.03',
      link: '../../supplyChain/view/3'
    },
  ];

  constructor(
    private supplyChainService: SupplyChainService,
    private router: Router,
    private alertService: AlertService
  ) { }


  async ngOnInit() {
    await this.alertService.notifyFirstVisit(
      'supplyChain:shop',
      'Welcome to the Supply Chain Module',
      `
        <div style="text-align: left;">
          <p>
            In this module, you’re stepping into a blockchain-powered supply chain—think of it like <strong>Amazon’s</strong> logistics engine, but <strong>fully</strong> on-chain and transparent.
          </p><br>
          <p>
            Under the hood, <strong>Provenance.sol</strong> records every product lifecycle event with <code>CreatedRecord</code> & <code>UpdatedRecord</code> events, using a reentrancy guard and an optional automatedProcess to handle on-chain value flows.
            Meanwhile, <strong>InventoryManagement.sol</strong> tracks stock via <code>StockUpdated</code> and <code>ItemTransferred</code> events, storing each <code>InventoryTransaction</code> on-chain.
          </p><br>
          <p><strong>Devs & Recruiters:</strong> WebSocket listeners pick up those events in real time, push them through our Node/Express API into MongoDB, and the Angular UI updates instantly—demonstrating a true full-stack, event-driven supply-chain system.</p>
        </div>
      `.trim(),
      {
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );

    await this.getItems();
  }

  async getItems() {
    this.inventoryManagementContract = this.supplyChainService.inventoryManagementContract;
    let items: Item[] = [];
    const nextId: ethers.BigNumber = await this.inventoryManagementContract.nextItemId();
    for (let i = 1; i < nextId.toNumber(); i++) {
      const item: Item = await this.inventoryManagementContract.items(i);
      items.push(item);
      this.shopGridPost[i - 1].title = item.name;
    }
    if (items.length > 0) {
      console.log("Items: ", items);
    } else {
      throw new Error("No items from contract");
    }
  }

  viewItem(routerLink: string) {
    console.log("Navigating to: ", routerLink);
    this.router.navigate([routerLink]);
  }

}
