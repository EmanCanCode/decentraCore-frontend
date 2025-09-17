import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
// import { DisplayedProperty, RealEstateMetadata } from 'src/app/interfaces/interfaces';
import { DisplayedProperty, RealEstateMetadata } from '../../../../interfaces/interfaces';
import { Web3Service } from '../../../../services/web3/web3.service';
import { environment } from '../../../../../environments/environment';
import $ from 'jquery';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';



@Component({
  selector: 'app-shopleft',
  templateUrl: './shopleft.component.html',
  styleUrls: ['./shopleft.component.css']
})
export class ShopleftComponent implements OnInit {
  filter = {
    singleFamily: true,
    multiFamily: true,
    luxury: true,
  };

  // Where we store *all* fetched items
  allProperties: DisplayedProperty[] = [];

  // The subset displayed after filtering
  displayedProperties: DisplayedProperty[] = [];

  constructor(
    private web3Service: Web3Service,
    private router: Router,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    console.log(`${environment.seederAddresses.seeder1} is seeder1`);

    await this.getPropertyList();
    await this.alertService.notifyFirstVisit(
      'realEstate:shop',
      'Welcome to the Real Estate Marketplace',
      `
        <p>
          Discover properties tokenized as <strong>ERC-1155 NFTs</strong> with a browsing experience reminiscent of Zillow—only here, every listing, offer, and transfer is recorded immutably on-chain.
        </p><br>
        <p>On-chain escrow contracts handle offers, deposits, and transfers automatically and trustlessly, effectively making the entire traditional real estate process obsolete.</p><br>
        <p><strong>Devs & Recruiters:</strong> WebSocket listeners push on-chain events through a Node/Express API into MongoDB, and the Angular app updates in real time—showcasing a true full-stack blockchain solution.</p><br>
        <p><strong>Note:</strong> This runs on a local Hardhat test network, which I occasionally reset to keep things fresh—if data disappears, that’s why. If so, clear your Activity Tab Data in MetaMask settings.</p>
      `.trim(),
      {
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }

  async getPropertyList() {
    const contract = await this.web3Service.getRealEstateContract();
    if (!contract) {
      console.error('No RealEstateContract found');
      return;
    }

    // For IDs 1..9:
    for (let i = 1; i <= 9; i++) {
      // figure out which "seeder" address to use
      let seederAddress: string;
      switch (i) {
        case 1: case 2: case 3:
          seederAddress = environment.seederAddresses.seeder1;
          break;
        case 4: case 5: case 6:
          seederAddress = environment.seederAddresses.seeder2;
          break;
        default:
          seederAddress = environment.seederAddresses.seeder3;
          break;
      }

      // check if user actually has that ID
      const balance: ethers.BigNumber = await contract.balanceOf(seederAddress, i);
      if (balance.gt(0)) {
        // fetch URI from contract
        const uri = await contract.uri(i);

        // use jQuery to fetch metadata from that URI
        $.ajax({
          url: uri,
          type: 'GET',
          success: (data: RealEstateMetadata) => {
            // create property object
            const category = this.getCategoryById(i); // see helper function below
            const { description, image, attributes } = data;

            const newProp: DisplayedProperty = {
              id: i,
              category,
              description,
              image,
              attributes,
              price: (i + 1) / 2  // example price formula
            };

            this.allProperties.push(newProp);

            // Now apply your *current* filter settings
            this.applyFilters();
          },
          error: (error) => {
            console.error('Error fetching property data for ID=', i, error);
          }
        });
      }
    }
  }

  // Helper to map ID ranges -> category
  getCategoryById(id: number): 'Single Family' | 'Multi-Family' | 'Luxury' {
    if (id >= 1 && id <= 3) return 'Single Family';
    if (id >= 4 && id <= 6) return 'Multi-Family';
    return 'Luxury';
  }

  // Called whenever filters change or new items are added
  applyFilters() {
    // example: only show properties whose category is "enabled" in filters
    // or if you have an array of strings from handleFilterChange, you'd compare them
    const selected: string[] = [];
    if (this.filter.singleFamily) selected.push('Single Family');
    if (this.filter.multiFamily) selected.push('Multi-Family');
    if (this.filter.luxury) selected.push('Luxury');

    // filter allProperties
    this.displayedProperties = this.allProperties.filter(item =>
      selected.includes(item.category)
    );
  }

  // Called from child component or your shop sidebar
  handleFilterChange(selectedFilters: string[]): void {
    console.log('Filters selected:', selectedFilters);

    // reset our toggles if you want
    this.filter.singleFamily = selectedFilters.includes('Single Family');
    this.filter.multiFamily = selectedFilters.includes('Multi-Family');
    this.filter.luxury = selectedFilters.includes('Luxury');

    // apply filters to allProperties
    this.applyFilters();
  }

  sortProperties(selectedValue: string): void {
    // Convert string to number if needed
    const sortOption = parseInt(selectedValue, 10);

    switch (sortOption) {
      case 2:
        // Sort by price ascending
        this.displayedProperties.sort((a, b) => a.price - b.price);
        break;
      case 3:
        // Sort by price descending
        this.displayedProperties.sort((a, b) => b.price - a.price);
        break;
      default:
        // case 1 or anything else = default sorting
        // If you had a "default" order, you might re-fetch or store an original array
        // For now, do nothing or revert to an original saved order
        break;
    }
  }

  viewProperty(id: number) {
    console.log("Navigating to realEstate/view/" + id);
    this.router.navigate(['realEstate', 'view', id]);
  }
}
