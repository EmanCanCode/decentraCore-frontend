// src/app/alert.service.ts

import { Injectable } from '@angular/core';
import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult
} from 'sweetalert2';
import { Web3Service } from '../web3/web3.service';
import { FinanceService } from '../finance/finance.service';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // tracks whether we've shown the welcome notice this session
  private welcomeNotified = false;

  /** tracks first-visit notices per routeKey (e.g. 'finance:cpamm') */
  private visitedRoutes = new Map<string, boolean>();

  constructor(
    private web3Service: Web3Service,
    private financeService: FinanceService
  ) { }

  /**
   * Only shows once per session
   */
  async welcome(
    icon: SweetAlertIcon,
    title: string,
    text?: string,
    options?: SweetAlertOptions
  ) {
    if (this.welcomeNotified) return;
    this.welcomeNotified = true;
    if (options) {
      console.log('AlertService.welcome: using custom options', options);
      options.background = '#353530';
      options.color = 'white';
      console.log('AlertService.welcome: updated options', options);
    }
    await Swal.fire({ icon, title, text, ...options });
  }

  /**
   * Generic fire method
   */
  fire(
    icon: SweetAlertIcon,
    title: string,
    text?: string,
    options?: SweetAlertOptions
  ): Promise<SweetAlertResult> {
    if (text && options && options.html) {
      console.warn('AlertService.fire: both text and html provided, using html only');
      text = undefined; // clear text if html is provided
    }
    if (text && options && !options.html) {
      options.html = `
        <div style="text-align: left">
          <p>${text}</p>
        </div>
      `;
      text = undefined; // clear text since we are using html
    }

    if (icon === 'info' && options) {
      // confirmButtonColor: '#4da6ff',
      //   customClass: { confirmButton: 'main-btn' }
      options.confirmButtonColor = '#4da6ff';
      options.customClass = { confirmButton: 'main-btn swal-bg-modal' };
    }

    if (icon === 'warning' && options) {
      options.customClass = { confirmButton: 'main-btn swal-warning swal-bg-modal' };
    }

    if (icon === 'error' && options) {
      options.customClass = { confirmButton: 'main-btn swal-error swal-bg-modal' };
    }

    options.background = '#353530';
    options.color = 'white';

    return Swal.fire({ icon, title, text, ...options });
  }

  /**
   * faucet notice & send
   */
  async alertFaucet(options?: SweetAlertOptions): Promise<void> {
    if (!options) {
      options = {};
      options.background = '#353530';
      options.color = 'white';
    }
    await Swal.fire({
      icon: 'warning',
      title: 'Funding Your Wallet',
      html: `
        <p>We’re sending you test tokens (and gas funds) now.</p>
        <p>Please <strong>check wallet balance to update</strong> before interacting with the dApp.</p>
      `.trim(),
      confirmButtonText: 'Thanks!',
      confirmButtonColor: '#4da6ff',
      customClass: { confirmButton: 'main-btn swal-warning' },
      ...options
    });
  }

  /**
   * Faucet check logic
   */
  async faucetCheck(): Promise<boolean> {
    const minEth = ethers.utils.parseEther('5');
    const minToken = ethers.utils.parseEther('1000000');
    const signer = this.web3Service.getSigner();
    const ethBal = await signer.getBalance();
    const tok1 = await this.financeService.emanToken1Contract.balanceOf(await signer.getAddress());
    const tok2 = await this.financeService.emanToken2Contract.balanceOf(await signer.getAddress());
    const half = (v: ethers.BigNumber) => v.div(2);

    let shouldSend = false;
    if (ethBal.lt(half(minEth)) || tok1.lt(half(minToken)) || tok2.lt(half(minToken))) {
      shouldSend = true;
      console.log('Balance low → showing faucet notice');
      await this.alertFaucet();
      try {
        console.log('…sending faucet');
        await this.web3Service.requestFaucet();
        console.log('…faucet sent');
      } catch (err) {
        console.error('Faucet send failed:', err);
      }
    }
    return shouldSend;
  }

  /**
   * NEW! Show a module-specific first-visit alert once per session.
   *
   * @param routeKey Unique key (e.g. 'finance:cpamm', 'realEstate:shop')
   * @param title     Dialog title
   * @param html      HTML body
   * @param options   Any extra SweetAlert2 options
   */
  async notifyFirstVisit(
    routeKey: string,
    title: string,
    html: string,
    options?: SweetAlertOptions
  ): Promise<void> {
    if (this.visitedRoutes.get(routeKey)) {
      return;
    }
    this.visitedRoutes.set(routeKey, true);
    options.background = '#353530';
    options.color = 'white';
    await this.fire(
      'info',
      title,
      '',
      {
        html,
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' },
        ...options
      }
    );
  }
}
