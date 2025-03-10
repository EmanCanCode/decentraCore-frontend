import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Web3Service } from 'src/app/services/web3/web3.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private web3Service: Web3Service,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // Ensure we run detectWallet (in case user hasn't done it yet)
    await this.web3Service.detectWallet();

    // Check if wallet is connected
    const isConnected = this.web3Service.isWalletConnected();

    if (!isConnected) {
      alert('Please install or connect a web3 wallet (e.g., MetaMask).');
      // Optionally redirect to a "no-wallet" page or home
      return this.router.parseUrl('/');
    }

    await this.web3Service.addAndSwitchChain().catch(err => {
      console.error('Failed to add and switch chain:', err);
      alert('Failed to add and switch chain. Please try again.');
      return this.router.parseUrl('/');
    });

    return true; // OK to proceed
  }
}
