import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ethers } from 'ethers';
import { Item } from 'src/app/interfaces/interfaces';
import { SupplyChainService } from 'src/app/services/supplyChain/supply-chain.service';

@Component({
  selector: 'app-supply-chain-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})  // SUPPLY CHAIN
export class ViewComponent implements OnInit {
  itemId: number = 0;
  item: Item;
  detailsliderConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": false,
    "arrows": false,
    "dots": false,
  };
  shopGridPost = [
    {
      img: 'assets/img/supplyChain/bearings.webp',
      title: '',
      tag: 'Sale',
      price: '0.01'
    },
    {
      img: 'assets/img/supplyChain/wafer.webp',
      title: '',
      tag: 'New',
      price: '0.02'
    },
    {
      img: 'assets/img/supplyChain/pellets.webp',
      title: '',
      tag: 'New',
      price: '0.03'
    },
  ];
  productRecords = [
    {
      productName: "Precision Bearings",
      variety: "High-grade bearings for industrial machinery",
      productType: "Industrial",
      timestamp: 0,
      location: "Texas, USA",
      state: 0,
      additionalInfo: "Precision bearings that are used for various things: industrial machinery, automotive, etc. This is a must have for any mechanical engineer."
    },
    {
      productName: "Semiconductor Wafers",
      variety: "Silicon wafers for chip fabrication",
      productType: "Industrial",
      timestamp: 0,
      location: "Taiwan",
      state: 0,
      additionalInfo: "Semi wafers - the world RUNS on these. You can't make chips without them. Is this the future of money?"
    },
    {
      productName: "Polypropylene Pellets",
      variety: "Versatile plastic pellets for molding applications",
      productType: "Industrial",
      timestamp: 0,
      location: "China",
      state: 0,
      additionalInfo: "pellets - what more can I say? They're used for everything. From toys to car parts, these are the building blocks of the modern world."
    },
  ];
  price = '';
  isFirstTimeBuyer = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplyChainService: SupplyChainService,
  ) { }

  async ngOnInit() {
    this.itemId = Number(this.route.snapshot.params['id']);
    if (
      isNaN(this.route.snapshot.params['id']) ||
      !this.itemId ||
      this.itemId < 1 ||
      this.itemId > 3
    ) {
      this.router.navigate(['404']);
    }

    const inventoryManagement = this.supplyChainService.inventoryManagementContract;
    this.item = await inventoryManagement.items(this.itemId);
    this.price = this.shopGridPost[this.itemId - 1].price;
    this.isFirstTimeBuyer = await this.supplyChainService.isFirstTimeBuyer();
  }

  get isInStock() {
    return this.item.quantity.gte(this.item.reorderThreshold);
  }

  toEvenHex(input: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    // Convert each byte to hex and join them
    let hex = Array.from(data)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    // Ensure even length
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }
    return '0x' + hex;
  }

  hexToString(input: string): string {
    // Remove the "0x" prefix
    const hex = input.startsWith('0x') ? input.slice(2) : input;
    // Convert hex pairs into a Uint8Array
    const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }

  async buyItem() {
    if (!this.isInStock) {
      return alert('Out of stock');
    } else if (!await this.supplyChainService.isFirstTimeBuyer()) {
      return alert('You have already purchased a product');
    } else if (!this.price) {
      return alert('Invalid price');
    }

    // assign timestamp to the respective product record
    const timestamp = Math.floor(Date.now() / 1000);
    let record = this.productRecords[this.itemId - 1];
    record.timestamp = timestamp;
    // create a new record
    const provenance = this.supplyChainService.provenanceContract;
    const _price = ethers.utils.parseEther(this.price);
    /*
      user calls provenance.createRecord(
        string memory _productName,
        string memory _variety,
        string memory _productType,
        uint256 _timestamp,
        string memory _location,
        State _state,
        string memory _additionalInfo
      )
    */
    try {
      const tx = await provenance.createRecord(
        record.productName,
        record.variety,
        record.productType,
        record.timestamp,
        record.location,
        record.state,
        record.additionalInfo,
        { value: _price }
      );

      const receipt = await tx.wait();
      if (!receipt.status) {
        throw new Error('Transaction failed');
      }
      this.isFirstTimeBuyer = false;
      console.log('Successfully purchased item / created record with provenance');
      console.log('Transaction receipt:', receipt);
      this.router.navigate(['supplyChain/myItem']);
    } catch (err) {
      console.error(err);
      alert('Transaction failed');
    }
  }
}

