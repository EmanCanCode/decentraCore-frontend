import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FinanceService } from 'src/app/services/finance/finance.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements CanActivate {

  constructor(
    private financeService: FinanceService,
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    // another guard runs the detectWallet function
    // so we can assume the wallet is connected
    // and the chain is added and switched

    // now we have to try to add the tokens to metamask
    // try {
    //   await this.financeService.addTokensToWallet();
    // } catch (error) {
    //   console.error('Failed to add tokens to wallet:', error);
    //   return false;
    // }
    return true;
  }



}
