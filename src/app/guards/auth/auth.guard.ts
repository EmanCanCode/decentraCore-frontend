// src/app/guards/auth.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { ethers } from 'ethers';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Web3Service } from 'src/app/services/web3/web3.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private web3Service: Web3Service,
    private alertService: AlertService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // 1. Ensure wallet is detected & connected
    await this.web3Service.detectWallet();
    if (!this.web3Service.isWalletConnected()) {
      await this.alertService.fire(
        'warning',
        'Wallet Not Connected',
        'Please connect your wallet to continue.',
        {
          confirmButtonText: 'Connect Wallet',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      await this.web3Service.connect();
      return this.router.parseUrl('/');
    }

    // 2. Switch or add the correct chain
    try {
      await this.web3Service.addAndSwitchChain();
    } catch (err) {
      console.error('Failed to switch chain:', err);
      await this.alertService.fire(
        'error',
        'Wrong Network',
        'Please switch to the correct blockchain network.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return this.router.parseUrl('/');
    }

    // 3. Faucet check & send if needed
    const didFund = await this.alertService.faucetCheck();
    if (didFund) {
      return false;
    }

    // 5. All clear—allow route activation
    return true;
  }
}
