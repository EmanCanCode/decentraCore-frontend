import { Component, OnInit } from '@angular/core';
import { RealEstateMetadata, UserRealEstateLifeCycle } from '../../../../interfaces/interfaces';
import { Web3Service } from '../../../../services/web3/web3.service';
import $ from 'jquery';
import { ethers } from 'ethers';
import { environment } from '../../../../../environments/environment';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-my-property',
  templateUrl: './my-property.component.html',
  styleUrls: ['./my-property.component.css']
})
export class MyPropertyComponent implements OnInit {
  nftAddress = environment.realEstateContracts.realEstate;
  propertyId: number | null = null;
  uri: string = '';
  metadata: RealEstateMetadata | null = null;
  price: number = 0;
  lifecycle: UserRealEstateLifeCycle | null = null;

  constructor(
    private web3Service: Web3Service,
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
  smallSliderPost: string[] = [];

  async ngOnInit() {
    /*
    theres only 4 possible states of lifecycle:
    - 'ownsProperty' | 'inEscrow' | 'inFinanceContract' | 'noProperty'
    */
    // Get the state of the user's real estate life cycle
    this.lifecycle = await this.web3Service.userRealEstateLifeCycle();
    // if the lifecycle state is 'noProperty', we can early return
    if (this.lifecycle.state === 'noProperty') {
      console.log('No property found');
      return;

    }
    await this.alertService.notifyFirstVisit(
      'realEstate:my-property',
      'Welcome to your property page!',
      `
        <p>Here you can view the details of your property, manage your escrow, and finalize your sale.</p><br>
        <p>If you haven’t received your property yet, please wait for the on-chain transaction to confirm.</p><br>
        <p><strong>Note:</strong> This demo runs on a local Hardhat network that I reset regularly for testing—if so, clear your Activity Tab Data in MetaMask settings as your data may reset from time to time.</p>
      `.trim(),
      {
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: {
          confirmButton: 'main-btn',
        }
      }
    );
    // by this point we know the user at least is in escrow or owns a property, so we can set the other state variables
    this.propertyId = this.lifecycle.propertyId ?? null;  // web3service always returns a propertyId if the lifecycle state is not 'noProperty'
    if (!this.propertyId) {
      console.error('No property id found');
      return;
    }
    this.price = this.getPriceById(this.propertyId);
    const contract = await this.web3Service.getRealEstateContract();
    if (!contract) {
      console.error('No contract found');
      return;
    }
    this.uri = await contract.uri(this.propertyId);
    await this.setMetadata(this.uri);

    console.log({
      lifecycle: this.lifecycle
    });
  }

  async setMetadata(uri: string): Promise<void> {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: uri,
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

  async onDepositEarnestClick() {
    // 1) Compute and format values
    const depositEth = (this.price * 0.01).toFixed(4); // 1% earnest
    const escrowAddr = this.web3Service.getEscrowFactoryContract().address;
    // (we assume the escrow contract itself is created and we have its address)
    const escrowShort = `${escrowAddr.slice(0, 6)}…${escrowAddr.slice(-4)}`;

    // 2) Build HTML alert
    const html = `
      <div style="text-align: left;">
        <p>You’re about to deposit <strong>${depositEth} ETH</strong> (1% earnest) into the Escrow contract at ${escrowShort}:</p><br>
        <p>By confirming, you’ll lock your 1% earnest deposit on-chain—just like placing a down payment in a traditional escrow, but without the paperwork or third-party delays.</p><br>
        <p><strong>Devs & Recruiters:</strong> Under the hood, the Escrow contract’s deposit function enforces exactly one deposit per buyer, records an immutable on-chain event, and uses a reentrancy guard to keep funds safe and transparent.</p>
      </div>
    `.trim();

    // 3) Show the modal
    await this.alertService.fire(
      'info',
      'About to Deposit Earnest',
      undefined,   // we’re using HTML
      {
        html,
        confirmButtonText: 'OK, deposit earnest',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }

  async depositEarnest() {
    if (!this.lifecycle) {
      console.log('No lifecycle found');
      return;
    } else if (this.lifecycle.state !== 'inEscrow') {
      console.log('You are not in escrow');
      return;
    } else if (
      !this.lifecycle.escrowLifeCycleState ||
      this.lifecycle.escrowLifeCycleState === 'Earnest Deposited'
    ) {
      console.log('You have already deposited earnest');
      return;
    } else if (!this.lifecycle.escrowAddress) {
      console.log('No escrow address found');
      return;
    }

    await this.onDepositEarnestClick(); // show the confirmation alert

    // get escrow contract instance
    const escrow = this.web3Service.getEscrowContract(this.lifecycle.escrowAddress);
    // get earnest amount (should be 1% of the property price)
    const earnestAmount: ethers.BigNumber = await escrow.earnest_amount();
    // call the depositEarnest function with the earnest amount as msg.value
    try {
      const tx = await escrow.depositEarnest({ value: earnestAmount });
      const receipt = await tx.wait();
      console.log('depositEarnest receipt', receipt);
      if (!receipt.status) {
        await this.alertService.fire(
          'error',
          'Transaction Failed',
          'There was an error processing your earnest deposit. Please try again later.',
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
        throw new Error('Transaction failed');
      }
      this.lifecycle.escrowLifeCycleState = 'Earnest Deposited';
      // success alert
      await this.alertService.fire(
        'success',
        'Earnest Deposited',
        'Your earnest deposit has been successfully recorded on-chain. You can now finalize the sale.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.log('Earnest deposited successfully');
    } catch (err) {
      console.error('Error depositing earnest', err);
      await this.alertService.fire(
        'error',
        'Error Depositing Earnest',
        'There was an error depositing your earnest. Please try again later.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }

  }

  async onFinalizeSaleClick() {
    // Build alert HTML
    const html = `
      <div style="text-align: left;">
        <p>When you finalize the sale, the contract will send the mortgage company the house in a mortgage contract on-chain. We’ll simulate the remaining 99% payment so you keep those funds available for other parts of the project.</p><br>
        <p><strong>Devs & Recruiters:</strong> Behind the scenes, <code>finalizeSale()</code> calculates fees, splits ETH to the seller and platform, and securely transfers the NFT—all under a reentrancy guard and strict state checks, emitting a <code>Completed</code> event for a full audit trail.</p>
      </div>
    `.trim();

    // Show the confirmation alert
    await this.alertService.fire(
      'info',
      'About to Finalize Sale',
      undefined,
      {
        html,
        confirmButtonText: 'OK, finalize sale',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }

  async finalizeSale() {
    // this could easily be solved with type guards
    if (!this.lifecycle) {
      console.log('No lifecycle found');
      return;
    } else if (this.lifecycle.state !== 'inEscrow') {
      console.log('You are not in escrow');
      return;
    } else if (
      !this.lifecycle.escrowLifeCycleState ||
      this.lifecycle.escrowLifeCycleState !== 'Earnest Deposited'
    ) {
      console.log('You have not deposited earnest yet');
      return;
    } else if (!this.lifecycle.escrowAddress) {
      console.log('No escrow address found');
      return;
    }

    await this.onFinalizeSaleClick(); // show the confirmation alert

    return new Promise(async () => {
      const data = { escrowAddress: this.lifecycle!.escrowAddress };
      // call /api/realEstate/complete-escrow.
      $.ajax({
        url: `${environment.api}/api/realEstate/complete-escrow`,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: async () => {
          console.log("Sale finalized");
          this.lifecycle!.state = 'inFinanceContract';
          await this.alertService.fire(
            'success',
            'Sale Finalized',
            'Your sale has been successfully finalized. You can now pay off the property.',
            {
              confirmButtonText: 'OK',
              confirmButtonColor: '#4da6ff',
              customClass: { confirmButton: 'main-btn' }
            }
          );
        },
        error: async (error: any) => {
          console.error('Error finalizing sale', error);
          await this.alertService.fire(
            'error',
            'Error Finalizing Sale',
            'There was an error finalizing your sale. Please try again later.',
            {
              confirmButtonText: 'OK',
              confirmButtonColor: '#4da6ff',
              customClass: { confirmButton: 'main-btn' }
            }
          );
        }
      })
    });
  }

  async onPayOffClick() {
    // Calculate amounts using ethers.js
    const purchasePriceBN = ethers.utils.parseEther(this.price.toString());
    const earnestBN = purchasePriceBN.div(100);
    const remainingBN = purchasePriceBN.sub(earnestBN);
    const earnestEth = ethers.utils.formatEther(earnestBN);
    const remainingEth = ethers.utils.formatEther(remainingBN);

    // Shorten addresses for display
    const lenderFull = await this.web3Service
      .getEscrowContract(this.lifecycle!.escrowAddress)
      .lender();
    const lenderShort = `${lenderFull.slice(0, 6)}…${lenderFull.slice(-4)}`;
    const buyerFull = await this.web3Service.getSigner().getAddress();
    const buyerShort = `${buyerFull.slice(0, 6)}…${buyerFull.slice(-4)}`;

    // Build the alert HTML
    const html = `
      <div style="text-align: left;">
        <p>
          Your property NFT is held on-chain by the mortgage company—just like they’d hold a deed until you finish paying.
        </p><br>
        <p>
          You’ve already deposited <strong>${earnestEth} ETH</strong> (1%) as earnest. We’ll now simulate paying the remaining
          <strong>${remainingEth} ETH</strong> (99%) so you keep those funds free for other parts of the project.
        </p><br>
        <ul style="padding-left: 1.5em; margin: 0 0 1em 0; line-height: 1.4;">
          <li style="margin-bottom: 0.5em;"><strong>NFT ID:</strong> ${this.propertyId}</li>
          <li style="margin-bottom: 0.5em;"><strong>Earnest Paid (1%):</strong> ${earnestEth} ETH</li>
          <li style="margin-bottom: 0.5em;"><strong>Simulated Payoff (99%):</strong> ${remainingEth} ETH</li>
          <li style="margin-bottom: 0.5em;"><strong>Buyer:</strong> ${buyerShort}</li>
          <li><strong>Lender:</strong> ${lenderShort}</li>
        </ul><br>
        <p>
          <strong>Devs & Recruiters:</strong> We calculate the 1% deposit on-chain, then simulate the 99% payoff—all under the same robust state checks and reentrancy guards, with an immutable <code>Deposit</code> event for full auditability.
        </p>
      </div>
    `.trim();

    // Show the confirmation alert
    await this.alertService.fire(
      'info',
      'About to Pay Off Loan',
      undefined,
      {
        html,
        confirmButtonText: 'OK, pay it off',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }

  async payOff() {
    if (!this.lifecycle) {
      console.log('No lifecycle found');
      return;
    } else if (this.lifecycle.state !== 'inFinanceContract') {
      console.log('You are not in a finance contract');
      return;
    }

    await this.onPayOffClick(); // show the confirmation alert

    // this just calls the real estate finance contract's payOff function. it sends the nft to the user's wallet
    const realEstateFinanceContract = this.web3Service.realEstateFinanceContract;
    const signerAddress = await this.web3Service.getSigner().getAddress();
    try {
      // call payOff function
      const tx = await realEstateFinanceContract.payOff(
        signerAddress,
        this.lifecycle.propertyId
      );
      const receipt = await tx.wait();
      console.log('payOff receipt', receipt);

      if (!receipt.status) {
        await this.alertService.fire(
          'error',
          'Transaction Failed',
          'There was an error processing your payment. Please try again later.',
          {
            confirmButtonText: 'OK',
            confirmButtonColor: '#4da6ff',
            customClass: { confirmButton: 'main-btn' }
          }
        );
        throw new Error('Transaction failed');
      }
      // update lifecycle
      this.lifecycle.state = 'ownsProperty';
      console.log('Paid off successfully');
      await this.alertService.fire(
        'success',
        'Property Paid Off',
        'Congratulations! You have successfully paid off your property. You now own the NFT outright in your wallet.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
    } catch (err) {
      console.error('Error paying off', err);
      await this.alertService.fire(
        'error',
        'Error Paying Off',
        'There was an error paying off your property. Please try again later.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      await this.alertService.fire(
        'success',
        'Copied to Clipboard',
        `The address "${text}" has been copied to your clipboard.`,
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
    } catch (err) {
      console.error('Failed to copy text', err);
      await this.alertService.fire(
        'error',
        'Copy Failed',
        'There was an error copying the text. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
    }
  }
}
