import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EscrowParams, RealEstateMetadata } from '../../../../interfaces/interfaces';
import { Web3Service } from '../../../../services/web3/web3.service';
import $ from 'jquery';
import { environment } from '../../../../../environments/environment';
import { ethers } from 'ethers';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  propertyId: number | null = null;
  uri: string = '';
  metadata: RealEstateMetadata | null = null;
  price: number = 0;
  hasVerified: boolean = false;
  isFirstTimeBuyer = false;
  hasCreatedEscrow = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public web3Service: Web3Service,
    private alertService: AlertService
  ) { }
  // Detail slider
  detailsliderConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 2500,
    "arrows": false,
    "dots": false,
  };
  detailslidertwoConfig = {
    "slidesToShow": 5,
    "slidesToScroll": 1,
    "fade": false,
    "infinite": true,
    "autoplay": false,
    "arrows": false,
    "dots": false,
    "focusOnSelect": true,
    "responsive": [{
      "breakpoint": 768,
      "settings": {
        "slidesToShow": 4,
      }
    }],
  };

  bigSliderPost: string[] = [];
  smallsliderpost: string[] = [];

  async ngOnInit() {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    // if propertyId is not 1-9, redirect to 404
    if (this.propertyId === null ||
      this.propertyId < 1 ||
      this.propertyId > 9) {
      this.router.navigate(['error']);
    }

    await this.alertService.notifyFirstVisit(
      'realEstate:view',
      'Explore Property Details',
      `
        <p>On this page, you can inspect a single property’s metadata—ownership history, on-chain provenance, and escrow status—all stored in the token’s attributes.</p><br>
        <p><strong>Devs & Recruiters:</strong> Any state changes (offers accepted, deposits released) fire events, caught by WebSocket listeners and reflected instantly in your Node/Express → MongoDB backend and the Angular UI.</p><br>
        <p><strong>Note:</strong> Since this is a local Hardhat network, I periodically reset it to free up resources—if your history resets, that’s why. If so, clear your Activity Tab Data in MetaMask settings.</p>
      `.trim(),
      {
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );

    const contract = await this.web3Service.getRealEstateContract();
    if (!contract) {
      console.error('Failed to get real estate contract');
      return;
    }
    this.uri = await contract.uri(this.propertyId);
    this.price = this.getPriceById(this.propertyId);
    $.ajax({
      url: this.uri,
      type: 'GET',
      success: async (metadata: RealEstateMetadata) => {
        // set metadata state variable
        this.metadata = metadata;
        // set bigSliderPost state variable
        this.bigSliderPost = [
          this.metadata.image,
          ...this.metadata.otherImages
        ];
        // set smallsliderpost state variable
        this.smallsliderpost = [
          ...this.metadata.otherImages
        ];

        // get faucet
        await this.web3Service.requestFaucet();

        // determine if user is first time buyer
        const lifecycle = await this.web3Service.userRealEstateLifeCycle();
        if (lifecycle.state === 'noProperty') {
          this.isFirstTimeBuyer = true;
        }

        // check if escrow data has been verified for this property id
        const factory = this.web3Service.getEscrowFactoryContract();
        const params = await this.createEscrowParams(this.sellerAddress);
        const escrowId = this.computeEscrowId(params);
        this.hasVerified = await factory.verifiedEscrowIds(escrowId);
      },
      error: (error: any) => {
        console.error('Error fetching metadata', error);
      },
    });
  }

  getPriceById(id: number): number {
    if (id === 1) {
      return 1;
    } else {
      return (id - 1) / 2 + 1;
    }
  }

  get sellerAddress() {
    let seller: string;
    switch (this.propertyId) {
      case 1:
      case 2:
      case 3:
        seller = environment.seederAddresses.seeder1;
        break;
      case 4:
      case 5:
      case 6:
        seller = environment.seederAddresses.seeder2;
        break;
      case 7:
      case 8:
      case 9:
        seller = environment.seederAddresses.seeder3;
        break;
      default:
        console.log('Invalid property id');
        throw new Error('Invalid property id');
    }

    return seller;
  }

  async onBuyClick() {
    // Truncate addresses
    const sellerFull = this.sellerAddress;
    const sellerShort = `${sellerFull.slice(0, 6)}...${sellerFull.slice(-4)}`;
    const buyerFull = await this.web3Service.getSigner().getAddress();
    const buyerShort = `${buyerFull.slice(0, 6)}...${buyerFull.slice(-4)}`;

    // Build HTML with left-aligned list
    const html = `
      <div style="text-align: left;">
        <p>You’re about to cryptographically sign the escrow details for Property #${this.propertyId}:</p><br>
        <ul style="padding-left: 1.5em; margin: 0 0 1em 0; line-height: 1.4;">
          <li style="margin-bottom: 0.5em;"><strong>NFT ID:</strong> ${this.propertyId}</li>
          <li style="margin-bottom: 0.5em;"><strong>Purchase Price:</strong> ${this.price} ETH</li>
          <li style="margin-bottom: 0.5em;"><strong>Seller:</strong> ${sellerShort}</li>
          <li><strong>Your Address:</strong> ${buyerShort}</li>
        </ul><br>
        <p>This signature lets our backend & escrow factory verify your intent on-chain. You’ll confirm it in MetaMask next.</p><br>
        <p><strong>Devs & Recruiters:</strong> We leverage EIP-191 signatures plus an EscrowFactory pattern to securely verify parameters before deploying each Escrow contract.</p>
      </div>
    `.trim();

    await this.alertService.fire(
      'info',
      'About to Sign Escrow Params',
      undefined,    // no plain-text
      {
        html,
        confirmButtonColor: '#4da6ff',
        confirmButtonText: 'OK, sign it',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }

  async onCreateEscrowClick() {
    const sellerFull = this.sellerAddress;
    const sellerShort = `${sellerFull.slice(0, 6)}…${sellerFull.slice(-4)}`;
    const buyerFull = await this.web3Service.getSigner().getAddress();
    const buyerShort = `${buyerFull.slice(0, 6)}…${buyerFull.slice(-4)}`;
    const factoryAddr = this.web3Service.getEscrowFactoryContract().address;
    const factoryShort = `${factoryAddr.slice(0, 6)}…${factoryAddr.slice(-4)}`;

    // Build the HTML with spacing
    const html = `
      <div style="text-align: left;">
        <p>You’re about to deploy a new Escrow contract via <strong>EscrowFactory</strong> at ${factoryShort}:</p><br>
        <ul style="padding-left: 1.5em; margin: 0 0 1em 0; line-height: 1.4;">
          <li style="margin-bottom: 0.5em;"><strong>NFT ID:</strong> ${this.propertyId}</li>
          <li style="margin-bottom: 0.5em;"><strong>Buyer:</strong> ${buyerShort}</li>
          <li><strong>Seller:</strong> ${sellerShort}</li>
        </ul><br>
        <p>Once mined, our event listeners will catch the <code>EscrowCreated</code> event, update the backend DB, and your UI will reflect the new escrow automatically.</p><br>
        <p><strong>Devs & Recruiters:</strong> This factory + event-driven pattern decouples on-chain escrow deployment from off-chain state, ensuring real-time sync and auditability.</p>
      </div>
    `.trim();

    await this.alertService.fire(
      'info',
      'About to Create Escrow',
      undefined, // use html instead of text
      {
        html,
        confirmButtonText: 'OK, deploy escrow',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }


  async verifyEscrowData() {
    // ensure propertyId is valid
    if (!this.propertyId) {
      console.error('Invalid property id');
      return;
    }

    await this.onBuyClick();  // show confirmation dialog before proceeding

    // get seller / seeder address
    const seller = this.sellerAddress;

    const purchasePrice = ethers.utils.parseEther(this.price.toString());  // in wei
    const data = {
      buyer: await this.web3Service.getSigner().getAddress(),
      seller,
      nftId: this.propertyId,
      purchasePrice: purchasePrice.toString()
    };

    // have user sign escrow data
    const messageDigest = await this.web3Service.createEscrowSignatureDigest(
      data.nftId,
      purchasePrice,
      data.seller,
      data.buyer
    );
    const buyerSignature = await this.web3Service.signMessage(messageDigest).catch(err => {
      console.error('Failed to sign escrow data:', err);
    });

    if (!buyerSignature) {
      this.alertService.fire(
        'error',
        'Failed to Sign Escrow Data',
        'Please try again or contact support if the issue persists.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

    // call backend to get signatures
    const signatures = await this.getSignatures(data).catch(err => {
      console.error('Failed to get signatures from backend:', err);
    });

    if (!signatures) {
      this.alertService.fire(
        'error',
        'Failed to Get Signatures',
        'Please try again or contact support if the issue persists.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

    // now we need to call the escrow factory contract to verify the signatures
    const params = await this.createEscrowParams(seller);
    const factory = this.web3Service.getEscrowFactoryContract();
    console.log("factory address", factory.address);
    console.log('factory owner:', await factory.owner());

    try {
      const tx = await factory.connect(this.web3Service.getSigner()).verifyEscrowData(
        params,
        signatures.sellerSignature,
        buyerSignature,
        signatures.lenderSignature
      );
      const receipt = await tx.wait();
      console.log('Verify escrow data tx receipt:', receipt);
      let success = receipt.status ? true : false;
      console.log('tx success:', success);
      if (!success) {
        this.alertService.fire(
          'error',
          'Failed to Verify Escrow Data',
          'Please check the signatures and try again. If the issue persists, contact support.',
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
        console.error('Failed to verify signatures');
        return;
      } else {
        console.log('Signatures verified');
        this.alertService.fire(
          'success',
          'Escrow Data Verified',
          'The escrow data has been successfully verified. You can now create the escrow.',
          {
            confirmButtonText: 'Got it!',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
        this.hasVerified = true;
      }
    } catch (err) {
      console.error('Failed to verify signatures:', err);
      this.alertService.fire(
        'error',
        'Failed to Verify Escrow Data',
        'Please check the signatures and try again. If the issue persists, contact support.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }
  }

  async createEscrowFromVerified() {
    if (!this.hasVerified) { // check if escrow has been verified
      this.alertService.fire(
        'warning',
        'Escrow Not Verified',
        'You must verify the escrow data before creating an escrow.',
        {
          confirmButtonText: 'Verify Escrow',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

    await this.onCreateEscrowClick();  // show confirmation dialog before proceeding

    const params = await this.createEscrowParams(this.sellerAddress);
    const escrowId = this.computeEscrowId(params);
    const factory = this.web3Service.getEscrowFactoryContract();
    try {
      const tx = await factory.createEscrowFromVerified(params, escrowId);
      const receipt = await tx.wait();
      console.log('Create escrow tx receipt:', receipt);
      if (receipt.status) {
        console.log('Escrow created');
        this.isFirstTimeBuyer = false;
        await this.alertService.fire(
          'success',
          'Escrow Created!',
          'Your escrow contract has been deployed successfully. You can now view your property under My Property.',
          {
            confirmButtonText: 'Got it!',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
        await new Promise(res => setTimeout(res, 250)); // wait for UI to update
        this.hasCreatedEscrow = true;  // trigger UI updates
        // this.router.navigate(['/realEstate/myProperty']);
      } else {
        this.alertService.fire(
          'error',
          'Failed to Create Escrow',
          'There was an error creating the escrow. Please try again or contact support.',
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
      }
    } catch (err) {
      console.error('Failed to create escrow:', err);
      this.alertService.fire(
        'error',
          'Failed to Create Escrow',
          'There was an error creating the escrow. Please try again or contact support.',
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
    }
  }

  computeEscrowId(params: EscrowParams): string {
    const idBytes = ethers.utils.solidityPack(
      [
        'address', // buyer
        'address', // seller
        'address', // nft address
        'uint256', // nft id
        'uint256' // nonce
      ],
      [
        params.buyer,
        params.seller,
        params.nft_address,
        params.nft_id,
        ethers.BigNumber.from(1)   // by default nonce is 1. only one time buy
      ]
    );
    return ethers.utils.solidityKeccak256(['bytes'], [idBytes]);
  }

  getSignatures(
    data: {
      buyer: string,
      seller: string,
      nftId: number,
      purchasePrice: string
    }
  ): Promise<{ sellerSignature: string, lenderSignature: string }> {
    return new Promise(async (resolve, reject) => {
      // call backend to get signatures
      $.ajax({
        url: `${environment.api}/api/realEstate/create-signatures`,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: async (
          response: { sellerSignature: string, lenderSignature: string }
        ) => {
          console.log('Got signatures from backend:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error fetching signatures', error);
          reject(error);
        }
      })
    });
  }

  async createEscrowParams(seller: string): Promise<EscrowParams> {  // creates the solidity struct thats needed to create an escrow
    if (!this.propertyId) {
      console.error('Invalid property id');
      throw new Error('Invalid property id');
    }
    const signer = this.web3Service.getSigner();
    return {
      nft_address: environment.realEstateContracts.realEstate,
      nft_id: this.propertyId,
      nft_count: 1,
      purchase_price: ethers.utils.parseEther(this.price.toString()),
      earnest_amount: ethers.utils.parseEther(this.price.toString()).div(100),
      seller,
      buyer: await signer.getAddress(),
      inspector: environment.escrowManager,
      lender: environment.escrowManager,
      appraiser: environment.escrowManager
    }
  }

  async onViewPropertyClick() {
    if (!this.hasCreatedEscrow) {
      this.alertService.fire(
        'warning',
        'Escrow Not Created',
        'You must create an escrow first before viewing the property.',
        {
          confirmButtonText: 'Create Escrow',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

    // redirect to myProperty page after quarter second bc automining sync...
    setTimeout(() => {
      this.router.navigate(['/realEstate/myProperty']);
    }, 250);
  }
}
