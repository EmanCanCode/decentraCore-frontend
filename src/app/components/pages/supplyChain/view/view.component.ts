import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ethers } from 'ethers';
import { Item } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/services/alert/alert.service';
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
    private alertService: AlertService
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

    await this.alertService.notifyFirstVisit(
      'supplyChain:view',
      'Explore Item Details',
      `
        <div style="text-align: left;">
          <p>
            On this page, you can inspect every detail of a single inventory item—
            its name, description, current quantity. After you buy an item, full location history
            all recorded on-chain via Provenance.
          </p><br>
          <p>
            <strong>Devs & Recruiters:</strong> Provenance.sol emits
            <code>CreatedRecord</code> & <code>UpdatedRecord</code> events, and
            InventoryManagement.sol emits <code>StockUpdated</code> &
            <code>ItemTransferred</code>. WebSocket listeners catch those events,
            push them through our Node/Express→MongoDB pipeline, and the Angular UI
            updates instantly—just like Amazon’s real-time item-tracking system.
          </p>
        </div>
      `.trim(),
      {
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );

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

  async onBuyItemClick() {
    const html = `
      <div style="text-align: left;">
        <p>
          You're about to purchase <strong>${this.item.name}</strong> for <strong>${this.price} ETH</strong>. After confirmation, you will be able to track the item’s provenance (Ordered → Shipped → Delivered) on the <a href="/supplyChain/myItem">My Item</a> page.
        </p><br>
        <p>
          <strong>Devs & Recruiters:</strong> Whenever the item's quantity goes below it's threshold (set on chain), we have the <code>AutomatedProcess</code> contract that will handle restocking items & managing funds between the you and the seller, like an escrow.
        </p><br>
        <p><strong>Note:</strong> This runs on a local Hardhat network I reset periodically—if your assets disappear, that’s why. In that case, be sure to clear the Activity Tab setting in MetaMask. </p>
      </div>
    `.trim();

    await this.alertService.fire(
      'info',
      'About to Swap',
      undefined,
      {
        html,
        confirmButtonText: 'OK, swap',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }

  async buyItem() {
    if (!this.isInStock) {
      return alert('Out of stock');
    } else if (!await this.supplyChainService.isFirstTimeBuyer()) {
      return alert('You have already purchased a product');
    } else if (!this.price) {
      return alert('Invalid price');
    }


    await this.onBuyItemClick();
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
        await this.alertService.fire(
          'error',
          'Transaction Failed',
          'The transaction did not complete successfully. Please try again.',
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff4d4d',
            customClass: { confirmButton: 'main-btn' }
          }
        );
        throw new Error('Transaction failed');
      }
      this.isFirstTimeBuyer = false;
      console.log('Successfully purchased item / created record with provenance');
      console.log('Transaction receipt:', receipt);
      await this.alertService.fire(
        'success',
        'Transaction Successful',
        'You have successfully purchased the item and created a record.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      this.router.navigate(['supplyChain/myItem']);
    } catch (err) {
      console.error(err);
      await this.alertService.fire(
        'error',
        'Transaction Failed',
        'There was an error processing your transaction. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      throw err; // rethrow the error to handle it in the calling function if needed
    }
  }
}

