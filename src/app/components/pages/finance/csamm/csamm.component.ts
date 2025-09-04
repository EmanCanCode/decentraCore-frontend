import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { BigNumber } from "bignumber.js";
import { TokenTitle } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-csamm',
  templateUrl: './csamm.component.html',
  styleUrls: ['./csamm.component.css']
})
export class CsammComponent implements OnInit {
  amountLPTsToReturn = 0;
  // Reserve values from contract (in wei, but will be displayed as ether strings)
  reserves = {
    emanToken1: '0',
    emanToken2: '0'
  };
  userLPTs = '0';
  totalLPTs = '0';
  userBalances = {
    emanToken1: '0',
    emanToken2: '0'
  };

  csamm: ethers.Contract; // CSAMM contract instance

  // For the Add Liquidity form (values entered in ether)
  amountToken1: string = '';
  amountToken2: string = '';

  // Example token list for display (unchanged)
  tokenList = [
    { img: 'assets/img/web3/emanToken1.png', title: 'Eman Token 1', qty: 0 },
    { img: 'assets/img/web3/emanToken2.png', title: 'Eman Token 2', qty: 0 },
  ];

  constructor(
    private financeService: FinanceService,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    // alert first time user visits the page
    await this.alertService.notifyFirstVisit(
      'finance:csamm',
      'Welcome to the Constant Sum AMM',
      `
        <div style="text-align: left;">
          <p>
            This module lets you supply equal amounts of two tokens into a <strong>Constant Sum AMM</strong>
            (x+y=k). Swaps execute at a fixed 1:1 rate—perfect for stablecoin pairs—until one reserve empties.
          </p><br>
          <p>
            <strong>Devs & Recruiters:</strong> The contract emits <code>AddedLiquidity</code>,
            <code>RemovedLiquidity</code>, and <code>Swapped</code> events. A WebSocketProvider
            streams these into MongoDB, and the Angular UI reflects them in real time—showcasing
            a robust full-stack DeFi architecture.
          </p><br>
          <p><strong>Note:</strong> This runs on a local Hardhat network that I reset periodically—if your pool data disappears, that’s why. In that case reset your Activity Tab setting in MetaMask.</p>
        </div>
      `.trim(),
      {
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );


    // Get CSAMM contract instance from the finance service
    this.csamm = this.financeService.constantSumContract;

    // Set reserves by converting from BigNumber (wei) to ether string (4 decimals)
    const _reserves = await this.financeService.getReserves('Constant Sum');
    this.reserves = {
      emanToken1: this.parseToEther(_reserves.emanToken1),
      emanToken2: this.parseToEther(_reserves.emanToken2)
    };

    // Set user LPTs
    this.userLPTs = this.parseToEther(await this.financeService.getUserLPTs('Constant Sum'));

    // Get user balance of Eman Token 1 and 2
    const userTokenBalances = await this.financeService.getUserTokenBalances();
    this.userBalances = {
      emanToken1: this.parseToEther(userTokenBalances.emanToken1),
      emanToken2: this.parseToEther(userTokenBalances.emanToken2)
    };

    // Get total LP tokens
    this.totalLPTs = this.parseToEther(await this.financeService.getTotalLPTs('Constant Sum'));
  }

  // Helper function to update the complementary token quantity
  async updateComplementaryQuantity(changedToken: TokenTitle, newValue: number): Promise<void> {
    if (newValue < 15_000) {
      await this.alertService.fire(
        'warning',
        'Minimum Swap Amount',
        'The minimum amount for a swap is 15,000 tokens.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ffcc00',
          customClass: { confirmButton: 'main-btn swal-warning' }
        }
      );
      console.warn('New value is below minimum swap amount');

      // Reset the changed token's quantity to 0
      const changedIndex = this.tokenList.findIndex(t => t.title === changedToken);
      this.tokenList[changedIndex].qty = 0;
      console.log(`Reset ${changedToken} quantity to 0 due to minimum amount requirement`);
      return;
    }

    let tokenContract: ethers.Contract;
    let amountOut: ethers.BigNumber;

    // find the index of the changed token
    const changedIndex = this.tokenList.findIndex(t => t.title === changedToken);
    const oppositeIndex = changedIndex === 0 ? 1 : 0;

    // get correct contract for changed token
    tokenContract = changedToken === 'Eman Token 1'
      ? this.financeService.emanToken1Contract
      : this.financeService.emanToken2Contract;

    // calculate output
    amountOut = await this.csamm.getAmountOut(
      tokenContract.address,
      ethers.utils.parseEther(newValue.toString())
    );

    // update both quantities correctly
    this.tokenList[changedIndex].qty = newValue;
    this.tokenList[oppositeIndex].qty = +Number(ethers.utils.formatEther(amountOut)).toFixed(4);
  }

  // Called when the input value changes directly
  async onChangeSwapInputValue(title: TokenTitle, event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    const newValue = Number(inputElement.value);
    if (isNaN(newValue) || newValue < 0) {
      await this.alertService.fire(
        'error',
        'Invalid Input',
        'Please enter a valid positive number.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Invalid input value:', newValue);
      return;
    }
    await this.updateComplementaryQuantity(title, newValue);
  }


  async import() {
    console.log('Importing tokens...');
    // add tokens to metamask
    try {
      await this.financeService.addTokensToWallet();
    } catch (error) {
      console.error('Failed to add tokens to wallet:', error);
      await this.alertService.fire(
        'error',
        'Import Failed',
        'An error occurred while trying to import tokens. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      return;
    }
  }

  // whatever token is first after this is called is what is given from the user
  changeOrder() {
    console.log('Order Changed');
    this.tokenList.reverse();
  }

  /**
 * Show a confirmation before calling swap()
 */
  async onSwapClick(tokenInSymbol: string, amountIn: string) {
    const html = `
      <div style="text-align: left;">
        <p>
          You’re about to approve tokens so the dApp can swap <strong>${amountIn} ${tokenInSymbol}</strong> against the Constant Sum AMM.
          MetaMask will prompt you to confirm the <code>swap()</code> transaction on-chain.
        </p><br>
        <p>
          <strong>Devs & Recruiters:</strong> Each swap applies a 0.3% fee, emits a <code>Swapped</code> event,
          and updates the reserves under the x·y=k invariant with full reentrancy protection.
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

  async swap() {
    // alert the user that they are about to swap
    await this.onSwapClick(this.tokenList[0].title, this.tokenList[0].qty.toString());

    // determine what token is given from the user
    const tokenIn = this.tokenList[0]; // changeOrder() determines what token is given
    // get token contract
    const tokenContract = tokenIn.title === 'Eman Token 1' ? this.financeService.emanToken1Contract : this.financeService.emanToken2Contract;
    // format the amount to wei
    const amountIn = ethers.utils.parseEther(tokenIn.qty.toString());
    // approve the CSAMM contract to spend the token at the amount

    const approved = await this.approveCsamm(amountIn, tokenContract);
    if (!approved) {
      await this.alertService.fire(
        'error',
        'Approval Failed',
        'Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Approval failed, cannot proceed with swap');
      return;
    }

    if (amountIn.lt(ethers.utils.parseEther('15000'))) {
      await this.alertService.fire(
        'warning',
        'Low Swap Amount',
        'Minimum is 15,000 tokens for Constant Sum.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ffcc00',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.warn('Swap amount is too low, aborting swap');
      return;
    }
    // swap the token swap(address _tokenIn, uint _amountReceived)
    try {
      const swapTx = await this.csamm.swap(tokenContract.address, amountIn);
      await swapTx.wait();
      console.log('Swapped', tokenIn.title, 'for the other token');
      console.log('Reserves and user balances will be updated...');
      // now we need to update the reserves and user balances
      const _reserves = await this.financeService.getReserves('Constant Sum');
      this.reserves = {
        emanToken1: this.parseToEther(_reserves.emanToken1),
        emanToken2: this.parseToEther(_reserves.emanToken2)
      };
      const userTokenBalances = await this.financeService.getUserTokenBalances();
      this.userBalances = {
        emanToken1: this.parseToEther(userTokenBalances.emanToken1),
        emanToken2: this.parseToEther(userTokenBalances.emanToken2)
      };
      console.log('Reserves and user balances updated');
      // alert the user that the swap was successful
      await this.alertService.fire(
        'success',
        'Swap Successful',
        `You have successfully swapped ${tokenIn.qty} ${tokenIn.title}.`,
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );

      // Clear the token quantities after swap
      this.tokenList.forEach(token => {
        token.qty = 0; // Reset the quantities after swap
      });
    } catch (error) {
      console.error('Error in swap:', error);
      await this.alertService.fire(
        'error',
        'Swap Failed',
        'An error occurred while trying to swap tokens. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Swap failed:', error);
      return;
    }
  }

  async approveCsamm(amountIn: ethers.BigNumber, tokenContract: ethers.Contract) {
    try {
      const tokenIn = this.tokenList[0];
      const approveTx = await tokenContract.approve(this.csamm.address, amountIn);
      await approveTx.wait();
      console.log('Approved CSAMM to spend', tokenIn.title, 'tokens');
      return true;
    } catch (error) {
      console.error('Error in approveCsamm:', error);
      await this.alertService.fire(
        'error',
        'Approval Failed',
        'An error occurred while trying to approve the CSAMM contract to spend your tokens. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Approval failed:', error);
      return false;
    }
  }

  // Called when either input changes
  async updateAddLiquidityValues(changedToken: 'token1' | 'token2'): Promise<void> {
    // check if whichever input changed is a number
    if (isNaN(Number(this.amountToken1)) && isNaN(Number(this.amountToken2))) {
      await this.alertService.fire(
        'error',
        'Invalid Input',
        'Please enter a valid number for at least one of the token amounts.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Both token amounts are invalid');
      return;
    }
    try {
      const reserves = await this.financeService.getReserves('Constant Sum');
      // Only calculate if both reserves exist
      if (this.csamm && !reserves.emanToken1.eq(0) && !reserves.emanToken2.eq(0)) {
        if (changedToken === 'token1' && this.amountToken1) {
          const requiredB = (() => {
            /*
             dy / dx = y / x
             dx = amount of tokenA reserve
             dy = amount of tokenB reserve
             x = amount of tokenA
             y = amount of tokenB
           */
            // get variables to calculate y
            const dx = BigNumber(reserves.emanToken1.toString());
            const dy = BigNumber(reserves.emanToken2.toString());
            const x = BigNumber(ethers.utils.parseEther(this.amountToken1).toString());
            // now solve for y
            const y = dy.times(x).dividedBy(dx).toFixed(0, BigNumber.ROUND_FLOOR);
            return ethers.BigNumber.from(y);
          })();

          // update Token 2 input
          this.amountToken2 = ethers.utils.formatEther(requiredB);
        } else if (changedToken === 'token2' && this.amountToken2) {
          const requiredA = (() => {
            /*
             dy / dx = y / x
             dx = amount of tokenA reserve
             dy = amount of tokenB reserve
             x = amount of tokenA
             y = amount of tokenB
           */
            // get variables to calculate x
            const dx = BigNumber(reserves.emanToken1.toString());
            const dy = BigNumber(reserves.emanToken2.toString());
            const y = BigNumber(ethers.utils.parseEther(this.amountToken2).toString());
            // now solve for x
            const x = dx.times(y).dividedBy(dy);
            const xRounded = x.integerValue(BigNumber.ROUND_FLOOR);

            return ethers.BigNumber.from(xRounded.toFixed(0));
          })();

          // update Token 1 input
          this.amountToken1 = ethers.utils.formatEther(requiredA);
        }
      }
    } catch (error) {
      await this.alertService.fire(
        'error',
        'Error Calculating Amounts',
        'An error occurred while calculating the required token amounts. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Error in updateAddLiquidityValues:', error);
      return;
    }
  }

  /**
 * Show a confirmation before calling addLiquidity()
 */
  async onAddLiquidityClick(amountA: string, amountB: string) {
    amountB = (() => {
      const [intPart, decPart = ""] = amountB.split(".");
      if (!decPart) {
        return intPart;
      }
      return `${intPart}.${decPart.slice(0, 4)}`;
    })();
    const html = `
      <div style="text-align: left;">
        <p>
          You’re about to add <strong>${amountA} Eman 1</strong> and <strong>${amountB} Eman 2</strong>
          to the pool, minting LP shares via the √(ΔA·ΔB) formula.
        </p><br>
        <p>
          <strong>Devs & Recruiters:</strong> The <code>AddedLiquidity</code> event is emitted,
          and WebSocket listeners push the update into MongoDB → Angular UI in real time—demonstrating full-stack DeFi.
        </p><br>
        <p><strong>Note:</strong> On a local Hardhat network that’s reset occasionally, your LP positions may vanish. If that is the case, reset your Activity Tab setting in MetaMask.</p>
      </div>
    `.trim();

    await this.alertService.fire(
      'info',
      'About to Add Liquidity',
      undefined,
      {
        html,
        confirmButtonText: 'OK, add liquidity',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }

  async onSubmitAddLiquidity(event: Event) {
    event.preventDefault();
    // ensure they have at sufficient balance
    const formattedAmounts = {
      amount1: ethers.utils.parseEther(this.amountToken1),
      amount2: ethers.utils.parseEther(this.amountToken2)
    };
    const balances = await this.financeService.getUserTokenBalances();
    if (formattedAmounts.amount1.gt(balances.emanToken1) || formattedAmounts.amount2.gt(balances.emanToken2)) {
      await this.alertService.fire(
        'error',
        'Insufficient Balance',
        'You do not have enough tokens to add liquidity. Please check your balances.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Insufficient balance for adding liquidity');
      return;
    }
    // alert the user that they are about to add liquidity
    await this.onAddLiquidityClick(
      this.amountToken1,
      this.amountToken2
    );

    console.table({
      action: 'Adding Liquidity',
      amount1: this.amountToken1,
      amount2: this.amountToken2,
      formattedAmount1: formattedAmounts.amount1,
      formattedAmount2: formattedAmounts.amount2
    });

    try {
      await this.financeService.addLiquidity(
        'Constant Sum',
        formattedAmounts.amount1,
        formattedAmounts.amount2
      );
      // Update reserves and user balances
      await this.refresh('LPTs');
      await this.refresh('balances');

      // Alert user of successful addition
      await this.alertService.fire(
        'success',
        'Liquidity Added',
        `You have successfully added Eman Token 1 and Eman Token 2 to the pool.`,
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      // Clear form
      this.amountToken1 = '';
      this.amountToken2 = '';

    } catch (err) {
      await this.alertService.fire(
        'error',
        'Error Adding Liquidity',
        'An error occurred while trying to add liquidity. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      // Log the error for debugging
      console.error('Error in onSubmitAddLiquidity:', err);
    }
  }

  parseToEther(wei: ethers.BigNumber) {
    const formatted = ethers.utils.formatEther(wei);
    const [whole, decimals] = formatted.split('.');
    return decimals ? whole + '.' + decimals.slice(0, 4) : whole;
  }

  async refresh(value: 'balances' | 'LPTs') {
    if (value === 'balances') {
      const userTokenBalances = await this.financeService.getUserTokenBalances();
      this.userBalances = {
        emanToken1: this.parseToEther(userTokenBalances.emanToken1),
        emanToken2: this.parseToEther(userTokenBalances.emanToken2)
      };
    } else if (value === 'LPTs') {
      this.userLPTs = this.parseToEther(await this.financeService.getUserLPTs('Constant Sum'));
      this.totalLPTs = this.parseToEther(await this.financeService.getTotalLPTs('Constant Sum'));
      // Update reserves
      const _reserves = await this.financeService.getReserves('Constant Sum');
      this.reserves = {
        emanToken1: this.parseToEther(_reserves.emanToken1),
        emanToken2: this.parseToEther(_reserves.emanToken2)
      };
      // Update user token balances
      const userTokenBalances = await this.financeService.getUserTokenBalances();
      this.userBalances = {
        emanToken1: this.parseToEther(userTokenBalances.emanToken1),
        emanToken2: this.parseToEther(userTokenBalances.emanToken2)
      };
    }
  }

  async onRemoveLiquidityClick() {
    const html = `
      <div style="text-align: left;">
        <p>
          You’re about to return <strong>${this.amountLPTsToReturn} LP tokens</strong> to the pool,
          receiving back Eman Token 1 and Eman Token 2 in proportion to your share.
        </p><br>
        <p>
          <strong>Devs & Recruiters:</strong> The <code>RemovedLiquidity</code> event is emitted,
          and WebSocket listeners push the update into MongoDB → Angular UI in real time—showcasing full-stack DeFi—check Analytics page.
        </p><br>
        <p><strong>Note:</strong> This runs on a local Hardhat network that I reset periodically—if your LP positions disappear, that’s why. In that case, be sure to clear the Activity Tab setting in MetaMask.</p>
      </div>
    `.trim();
    await this.alertService.fire(
      'info',
      'About to Remove Liquidity',
      undefined,
      {
        html,
        confirmButtonText: 'OK, remove liquidity',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );
  }

  async removeLiquidity() {
    if (!this.amountLPTsToReturn) {
      console.log({ amountLPTsToReturn: this.amountLPTsToReturn });
      await this.alertService.fire(
        'error',
        'No LP Tokens Specified',
        'Please specify the amount of LP tokens you want to return.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('No LP tokens specified for removal');
      return;
    }

    const bnAmountLPTsToReturn = ethers.utils.parseEther(this.amountLPTsToReturn.toString());
    const bnUserLPTs = ethers.utils.parseEther(this.userLPTs);
    if (bnAmountLPTsToReturn.gt(bnUserLPTs)) {
      await this.alertService.fire(
        'error',
        'Insufficient LP Tokens',
        'You do not have enough LP tokens to remove this amount. Please check your balance.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Insufficient LP tokens for removal');
      return;
    }

    // Alert the user that they are about to remove liquidity
    await this.onRemoveLiquidityClick();

    try {
      console.log('Removing liquidity...');
      const tx = await this.csamm.removeLiquidity(bnAmountLPTsToReturn);
      await tx.wait();
      console.log('Liquidity removed');
      // Update reserves and user balances
      await this.refresh('LPTs');
      await this.refresh('balances');
      // Alert user of successful removal
      await this.alertService.fire(
        'success',
        'Liquidity Removed',
        `You have successfully removed ${this.amountLPTsToReturn} LP tokens.`,
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );

      // Clear form
      this.amountLPTsToReturn = 0;
      console.log('Liquidity removed');
    } catch (error) {
      console.error('Error in removeLiquidity:', error);
      await this.alertService.fire(
        'error',
        'Error Removing Liquidity',
        'An error occurred while trying to remove liquidity. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Remove liquidity failed:', error);
      return;
    }
  }

}
