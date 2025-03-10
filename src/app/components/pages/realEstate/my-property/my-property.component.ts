import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RealEstateMetadata, UserRealEstateLifeCycle } from 'src/app/interfaces/interfaces';
import { Web3Service } from 'src/app/services/web3/web3.service';
import $ from 'jquery';

@Component({
  selector: 'app-my-property',
  templateUrl: './my-property.component.html',
  styleUrls: ['./my-property.component.css']
})
export class MyPropertyComponent implements OnInit {

  propertyId: number | null = null;
  uri: string = '';
  metadata: RealEstateMetadata | null = null;
  price: number = 0;
  lifecycle: UserRealEstateLifeCycle | null = null;

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
  smallSliderPost = [

  ];

  async ngOnInit() {
    /*
      theres only 4 possible states of lifecycle:
      - 'ownsProperty' | 'inEscrow' | 'inFinanceContract' | 'noProperty'
    */
    // Get the state of the user's real estate life cycle
    this.lifecycle = await this.web3Service.userRealEstateLifeCycle();
    // if the lifecycle state is 'noProperty', we can early return
    if (this.lifecycle.state === 'noProperty') {
      return;
    }
    // by this point we know the user at least is in escrow or owns a property, so we can set the other state variables
    this.propertyId = this.lifecycle.propertyId;  // web3service always returns a propertyId if the lifecycle state is not 'noProperty'
    this.price = this.getPriceById(this.propertyId);
    const contract = await this.web3Service.getRealEstateContract();
    this.uri = await contract.uri(this.propertyId);
    await this.setMetadata(this.uri);
  }

  async setMetadata(uri: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
          this.smallSliderPost = [
            ...this.metadata.otherImages
          ];
          resolve();
        },
        error: (error: any) => {
          console.error('Error fetching metadata', error);
          reject();
        },
      });
    });
  }

  getPriceById(id: number): number {
    if (id === 1) {
      return 1;
    } else {
      return (id - 1) / 2 + 1;
    }
  }


}
