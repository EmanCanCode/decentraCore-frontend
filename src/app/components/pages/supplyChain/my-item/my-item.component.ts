import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { Item } from 'src/app/interfaces/interfaces';
import { SupplyChainService } from 'src/app/services/supplyChain/supply-chain.service';
import { Web3Service } from 'src/app/services/web3/web3.service';


@Component({
  selector: 'app-my-item',
  templateUrl: './my-item.component.html',
  styleUrls: ['./my-item.component.css']
})
export class MyItemComponent implements OnInit {
  ownsItem = false;
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
  itemId = 0;
  state = 0; //  enum State { Created, InTransit, Completed } (solidity code)

  constructor(
    private supplyChainService: SupplyChainService,
    private web3Service: Web3Service,
    private router: Router
  ) { }

  async ngOnInit() {
    const userProductHistory = await this.supplyChainService.userProductHistory();
    if (userProductHistory === 'No Product History') {
      return;
    }

    this.ownsItem = true;
    // get the first element in the array
    let productRecord = userProductHistory[0];
    // now we need to get the item id, which is the index of the product record in the productRecords array + 1
    this.itemId = this.productRecords.findIndex((_record) => _record.productName === productRecord.productName) + 1;
    // get current record
    productRecord = userProductHistory[userProductHistory.length - 1];
    this.state = productRecord.state;
    console.log({
      ownsItem: this.ownsItem,
      itemId: this.itemId,
      state: this.state,
      productRecord
    });
  }

  async receiveItem() { // this completes the provenance of the item, gives the msg.value to the provenance contract owner
    // get provenance contract
    if (this.state == 2) {
      alert('Item already received');
      return;
    }
    const provenance = this.supplyChainService.provenanceContract;
    const productId = ethers.utils.solidityPack(
      [
        'address', // address
        'uint32' // nonce
      ],
      [
        await this.web3Service.signer.getAddress(), // address
        1 // will be 1 since i will only allow them to have one product at a time
      ]
    );
    try {
      /*
        function updateRecord(
          bytes memory _productId,
          uint256 _timestamp,
          string memory _location,
          State _state,
          string memory _additionalInfo
        )
      */
      const tx = await provenance.updateRecord(
        productId,
        Math.floor(Date.now() / 1000),
        "Location (not tracking)",
        2, // enum State { Created, InTransit, Completed } (solidity code)
        "Received by user"
      );
      const receipt = await tx.wait();
      console.log(receipt);
      if (!receipt.status) {
        throw new Error('Transaction failed');
      }

      this.state = 2;
      console.log('Successfully received item');
    } catch (err) {
      console.error(err);
      alert('Error receiving item');
    }
  }

}
