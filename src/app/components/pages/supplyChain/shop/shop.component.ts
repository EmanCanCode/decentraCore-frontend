import { Component, OnInit } from '@angular/core';
import { SupplyChainService } from '../../../../services/supplyChain/supply-chain.service';
import { ethers } from 'ethers';
import { Item } from 'src/app/interfaces/interfaces';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }


  async ngOnInit() {
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
