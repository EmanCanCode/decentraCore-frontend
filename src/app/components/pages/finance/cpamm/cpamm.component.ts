import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { FinanceService } from 'src/app/services/finance/finance.service';
import { BigNumber } from "bignumber.js";
import { TokenTitle } from 'src/app/interfaces/interfaces';
import { AlertService } from 'src/app/services/alert/alert.service';


@Component({
  selector: 'app-cpamm',
  templateUrl: './cpamm.component.html',
  styleUrls: ['./cpamm.component.css']
})
export class CpammComponent implements OnInit {
  // Reserve values from contract (in wei, but will be displayed as ether strings)
  reserves = {
    emanToken1: '0',
    emanToken2: '0'
  };
  userLPTs = '0';
  totalLPTs = '0';
  amountLPTsToReturn = 0;
  userBalances = {
    emanToken1: '0',
    emanToken2: '0'
  };

  cpamm: ethers.Contract; // CPAMM contract instance

  // For the Add Liquidity form (values entered in ether)
  amountToken1: string = '';
  amountToken2: string = '';

  // Example token list for display (unchanged)
  tokenList = [
    { img: 'assets/img/web3/emanToken1.png', title: 'Eman Token 1', qty: 1 },
    { img: 'assets/img/web3/emanToken2.png', title: 'Eman Token 2', qty: 1 },
  ];

  constructor(
    private financeService: FinanceService,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    await this.alertService.notifyFirstVisit(
      'finance:cpamm',
      'Welcome to the Constant Product AMM',
      `
        <div style="text-align: left;">
          <p>
            This module lets you add liquidity and swap tokens against a <strong>Constant Product AMM</strong>
            (x·y=k) with a built-in 0.3% fee. On first deposit, LP shares are minted via a square-root formula,
            and subsequent liquidity adds respect a 0.5% tolerance margin to keep price integrity.
          </p><br>
          <p>
            <strong>Devs & Recruiters:</strong>
            The Solidity contract emits <code>Swapped</code>, <code>AddedLiquidity</code> and <code>RemovedLiquidity</code> events.
            A Node.js WebSocketProvider streams these into MongoDB (using a <code>toReadableAmount</code> helper),
            powering real-time analytics in the Angular UI—showcasing production-grade DeFi architecture.
          </p><br>
          <p><strong>Note:</strong> Running on a local Hardhat network that I reset periodically—if your pool disappears, that’s why.</p>
        </div>
      `.trim(),
      {
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4da6ff',
        customClass: { confirmButton: 'main-btn' }
      }
    );


    // Get CPAMM contract instance from the finance service
    this.cpamm = this.financeService.constantProductContract;

    // Set reserves by converting from BigNumber (wei) to ether string (4 decimals)
    const _reserves = await this.financeService.getReserves('Constant Product');
    this.reserves = {
      emanToken1: this.parseToEther(_reserves.emanToken1),
      emanToken2: this.parseToEther(_reserves.emanToken2)
    };

    // Set user LPTs
    this.userLPTs = this.parseToEther(await this.financeService.getUserLPTs('Constant Product'));

    // Get user balance of Eman Token 1 and 2
    const userTokenBalances = await this.financeService.getUserTokenBalances();
    this.userBalances = {
      emanToken1: this.parseToEther(userTokenBalances.emanToken1),
      emanToken2: this.parseToEther(userTokenBalances.emanToken2)
    };

    // Get total LP tokens
    this.totalLPTs = this.parseToEther(await this.financeService.getTotalLPTs('Constant Product'));
  }

  // Helper function to update the complementary token quantity
  async updateComplementaryQuantity(changedToken: TokenTitle, newValue: number): Promise<void> {
    let tokenInIndex = this.tokenList.findIndex(token => token.title === changedToken);
    let tokenOutIndex = tokenInIndex === 0 ? 1 : 0;

    const tokenContract = changedToken === 'Eman Token 1'
      ? this.financeService.emanToken1Contract
      : this.financeService.emanToken2Contract;

    try {
      const amountOut = await this.cpamm.getAmountOut(
        tokenContract.address,
        ethers.utils.parseEther(newValue.toString())
      );

      this.tokenList[tokenInIndex].qty = newValue;
      this.tokenList[tokenOutIndex].qty = +Number(ethers.utils.formatEther(amountOut)).toFixed(4);
    } catch (err) {
      console.error("Error in updateComplementaryQuantity:", err);
      this.tokenList[tokenOutIndex].qty = 0;
    }
  }


  // Called when the input value changes directly
  async onChangeSwapInputValue(title: TokenTitle, event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    const newValue = Number(inputElement.value);
    if (isNaN(newValue) || newValue < 0) {
      const html = `
        <div style="text-align: left;">
          <p>
            You entered an invalid value. Only positive numbers are allowed.
          </p>
        </div>
      `;
      await this.alertService.fire(
        'error',
        'Invalid Input',
        undefined,
        {
          html,
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
        'There was an error while trying to import tokens. Please try again.',
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
          You’re about to approve tokens so the dApp can swap <strong>${amountIn} ${tokenInSymbol}</strong> against the Constant Product AMM.
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
    // alert user about the swap information
    await this.onSwapClick(this.tokenList[0].title, this.tokenList[0].qty.toString());
    // determine what token is given from the user
    const tokenIn = this.tokenList[0]; // changeOrder() determines what token is given
    // get token contract
    const tokenContract = tokenIn.title === 'Eman Token 1' ? this.financeService.emanToken1Contract : this.financeService.emanToken2Contract;
    // format the amount to wei
    const amountIn = ethers.utils.parseEther(tokenIn.qty.toString());
    // approve the CPAMM contract to spend the token at the amount
    const approved = await this.approveCpamm(amountIn, tokenContract);
    if (!approved) {
      return;
    }
    // swap the token swap(address _tokenIn, uint _amountReceived)
    try {
      const swapTx = await this.cpamm.swap(tokenContract.address, amountIn);
      await swapTx.wait();
      console.log('Swapped', tokenIn.title, 'for the other token');
      console.log('Reserves and user balances will be updated...');
      // now we need to update the reserves and user balances
      const _reserves = await this.financeService.getReserves('Constant Product');
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
      // alert user of success
      await this.alertService.fire(
        'success',
        'Swap Successful',
        `Successfully swapped ${tokenIn.qty} ${tokenIn.title}.`,
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      // Clear the input field
      this.tokenList[0].qty = 0; // Reset the input field for the token being swapped
      this.tokenList[1].qty = 0; // Reset the complementary token input field
      console.log('Swap successful');
    } catch (error) {
      console.error('Error in swap:', error);
      await this.alertService.fire(
        'error',
        'Swap Failed',
        'There was an error while trying to swap tokens. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Error in swap:', error);
    }
  }

  async approveCpamm(amountIn: ethers.BigNumber, tokenContract: ethers.Contract) {
    try {
      const tokenIn = this.tokenList[0];
      const approveTx = await tokenContract.approve(this.cpamm.address, amountIn);
      await approveTx.wait();
      console.log('Approved CPAMM to spend', tokenIn.title, 'tokens');
      return true;
    } catch (error) {
      console.error('Error in approveCpamm:', error);
      await this.alertService.fire(
        'error',
        'Approval Failed',
        'There was an error while trying to approve the CPAMM contract to spend your tokens. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Error in approveCpamm:', error);
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
        'Please enter a valid number for at least one token.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Invalid input for both tokens');
      return;
    }
    try {
      const reserves = await this.financeService.getReserves('Constant Product');
      // Only calculate if both reserves exist
      if (this.cpamm && !reserves.emanToken1.eq(0) && !reserves.emanToken2.eq(0)) {
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
      console.error("Error in updateAddLiquidityValues:", error);
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
    if (
      formattedAmounts.amount1.gt(balances.emanToken1) ||
        formattedAmounts.amount2.gt(balances.emanToken2)
    ) {
      this.alertService.fire(
        'error',
        'Insufficient Balance',
        'You do not have enough tokens to add this liquidity.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Insufficient balance to add liquidity');
      return;
    }

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
        'Constant Product',
        formattedAmounts.amount1,
        formattedAmounts.amount2
      );
      // Update reserves and user balances
      await this.refresh('LPTs');
      await this.refresh('balances');
      console.log('Liquidity added');
      // Clear form
      this.amountToken1 = '';
      this.amountToken2 = '';

      // Alert user of success
      await this.alertService.fire(
        'success',
        'Liquidity Added',
        `Successfully added ${this.amountToken1} Eman Token 1 and ${this.amountToken2} Eman Token 2 to the pool.`,
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.log('Liquidity added successfully');

    } catch (err) {
      await this.alertService.fire(
        'error',
        'Add Liquidity Failed',
        'There was an error while trying to add liquidity. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Error in onSubmitAddLiquidity:', err);
    }
  }

  parseToEther(wei: ethers.BigNumber) {
    const formatted = ethers.utils.formatEther(wei);
    const [whole, decimals] = formatted.split('.');
    return decimals ? whole + '.' + decimals.slice(0, 4) : whole;
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
      await this.alertService.fire(
        'error',
        'Invalid Input',
        'Please enter a valid amount of LP tokens to return.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Invalid input for amount of LP tokens to return');
      return;
    }

    const bnAmountLPTsToReturn = ethers.utils.parseEther(this.amountLPTsToReturn.toString());
    const bnUserLPTs = ethers.utils.parseEther(this.userLPTs);
    if (bnAmountLPTsToReturn.gt(bnUserLPTs)) {
      await this.alertService.fire(
        'error',
        'Insufficient LP Tokens',
        'You do not have enough LP tokens to remove this liquidity.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Insufficient LP tokens to remove liquidity');
      return;
    }

    await this.onRemoveLiquidityClick();

    try {
      console.log('Removing liquidity...');
      const tx = await this.cpamm.removeLiquidity(bnAmountLPTsToReturn);
      await tx.wait();
      console.log('Liquidity removed');
      // Update reserves and user balances
      await this.refresh('LPTs');
      await this.refresh('balances');
      // Alert user of success
      await this.alertService.fire(
        'success',
        'Liquidity Removed',
        `Successfully removed liquidity and returned ${this.amountLPTsToReturn} LP tokens.`,
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#4da6ff',
          customClass: { confirmButton: 'main-btn' }
        }
      );

      // Clear form
      this.amountLPTsToReturn = 0;
      console.log('Liquidity removed successfully');
    } catch (error) {
      console.error('Error in removeLiquidity:', error);
      await this.alertService.fire(
        'error',
        'Remove Liquidity Failed',
        'There was an error while trying to remove liquidity. Please try again.',
        {
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff4d4d',
          customClass: { confirmButton: 'main-btn' }
        }
      );
      console.error('Error in removeLiquidity:', error);
      return;
    }
  }

  async refresh(value: 'balances' | 'LPTs') {
    if (value === 'balances') {
      const userTokenBalances = await this.financeService.getUserTokenBalances();
      this.userBalances = {
        emanToken1: this.parseToEther(userTokenBalances.emanToken1),
        emanToken2: this.parseToEther(userTokenBalances.emanToken2)
      };
    } else if (value === 'LPTs') {
      this.userLPTs = this.parseToEther(await this.financeService.getUserLPTs('Constant Product'));
      this.totalLPTs = this.parseToEther(await this.financeService.getTotalLPTs('Constant Product'));
      // Update reserves
      const _reserves = await this.financeService.getReserves('Constant Product');
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
}
