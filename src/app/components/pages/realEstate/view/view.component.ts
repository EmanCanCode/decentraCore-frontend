import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EscrowParams, RealEstateMetadata } from 'src/app/interfaces/interfaces';
import { Web3Service } from 'src/app/services/web3/web3.service';
import $ from 'jquery';
import { environment } from 'src/environments/environment';
import { ethers } from 'ethers';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private web3Service: Web3Service
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

  bigSliderPost = [];
  smallsliderpost = [

  ];

  async ngOnInit() {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    // if propertyId is not 1-9, redirect to 404
    if (this.propertyId === null ||
      this.propertyId < 1 ||
      this.propertyId > 9) {
      this.router.navigate(['error']);
    }

    const contract = await this.web3Service.getRealEstateContract();
    this.uri = await contract.uri(this.propertyId);
    this.price = this.getPriceById(this.propertyId);
    $.ajax({
      url: this.uri,
      type: 'GET',
      success: (metadata: RealEstateMetadata) => {
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
      },
      error: (error: any) => {
        console.error('Error fetching metadata', error);
      }
    });

  }

  getPriceById(id: number): number {
    if (id === 1) {
      return 1;
    } else {
      return (id - 1) / 2 + 1;
    }
  }




  async buyProperty() {
    // get the seller address by the id of the property
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
    }

    const data = {
      buyer: await this.web3Service.signer.getAddress(),
      seller,
      nftId: this.propertyId,
      purchasePrice: ethers.utils.parseEther(this.price.toString()).toString()
    };

    console.log('Data:', data);

    // have user sign
    const messageDigest = await this.web3Service.createEscrowSignatureDigest(
      data.nftId,
      ethers.utils.parseEther(data.purchasePrice),
      data.seller,
      data.buyer
    );

    const buyerSignature = await this.web3Service.signMessage(messageDigest);
    if (!buyerSignature) {
      alert('To buy this property, you must sign the message');
      console.error('Failed to sign message');
      return;
    }
    console.log('Buyer signature:', buyerSignature);

    // call backend to get signatures
    let sellerSignature: string;
    let lenderSignature: string;
    try {
      const signatures = await this.getSignatures(data);
      sellerSignature = signatures.sellerSignature;
      lenderSignature = signatures.lenderSignature;

    } catch (err) {
      console.error('Failed to get signatures from backend:', err);
      alert('Failed to get signatures from backend');
      return;
    }

    // call escrow factory to verify signatures
    const escrowParams = await this.createEscrowParams(seller);
    const factory = this.web3Service.getEscrowFactoryContract();
    try {
      await factory.verifyEscrowData(escrowParams, sellerSignature, buyerSignature, lenderSignature);
    } catch (err) {
      console.error('Failed to verify signatures:', err);
      alert('Failed to verify signatures');
      return;
    }

    // call escrow factory to create escrow
    const nonce = await factory.nonce(data.buyer, data.seller);
    const escrowId = await factory._computeEscrowId(escrowParams, nonce.add(1));
    try {
      await factory.createEscrowFromVerified(escrowParams, escrowId);
      this.router.navigate(['/realEstate/myProperty'])
    } catch (err) {
      console.error('Failed to create escrow:', err);
      alert('Failed to create escrow');
      return;
    }
  }

  async getSignatures(
    data: {
      buyer: string,
      seller: string,
      nftId: number,
      purchasePrice: string
    }
  ): Promise<{ sellerSignature: string, lenderSignature: string }> {
    return new Promise(async (resolve, reject) => {
      console.log({ data });
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

  async createEscrowParams(seller: string): Promise<EscrowParams> {
    return {
      nft_address: environment.realEstateContracts.realEstate,
      nft_id: this.propertyId,
      nft_count: 1,
      purchase_price: ethers.utils.parseEther(this.price.toString()),
      earnest_amount: ethers.utils.parseEther(this.price.toString()).div(100),
      seller,
      buyer: await this.web3Service.signer.getAddress(),
      inspector: environment.escrowManager,
      lender: environment.escrowManager,
      appraiser: environment.escrowManager
    }
  }
}
