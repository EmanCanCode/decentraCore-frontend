import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { ObmmTradeRecord } from 'src/app/interfaces/interfaces';
import { FinanceService } from 'src/app/services/finance/finance.service';

@Component({
  selector: 'app-obmm',
  templateUrl: './obmm.component.html',
  styleUrls: ['./obmm.component.css']
})
export class ObmmComponent implements OnInit {
  obmm: ethers.Contract;  // the order book market maker contract
  selectedAction: string = 'Deposit';  // default value
  selectedAsset: string = 'ETH';
  assetAmount: string = '';
  statusMessage: string = '';
  txType: 'Trades' | 'Orders' = 'Trades';
  allTrades: ObmmTradeRecord[] = [];
  myTrades: {
    time: string;
    token: string;
    pair: string;
    amount: string;
  }[] = [
      {
        time: "03/06/2025, 10:20:15 AM",
        token: "ETH",
        pair: "ETH/EMAN1",
        amount: "1.2345"
      },
      {
        time: "03/06/2025, 10:25:42 AM",
        token: "EMAN1",
        pair: "ETH/EMAN1",
        amount: "0.5678"
      },
      {
        time: "03/06/2025, 10:30:00 AM",
        token: "ETH",
        pair: "ETH/EMAN2",
        amount: "2.0000"
      },
      {
        time: "03/06/2025, 10:35:30 AM",
        token: "EMAN2",
        pair: "ETH/EMAN2",
        amount: "0.8900"
      },
      {
        time: "03/06/2025, 10:40:00 AM",
        token: "EMAN1",
        pair: "EMAN1/EMAN2",
        amount: "1.1111"
      }
    ];
  myOpenOrders: {
    token: string;
    pair: string;
    amount: string;
    id: string;
  }[] = [];
  balances = {
    'ETH': {
      wallet: '',
      exchange: ''
    },
    'Eman Token 1': {
      wallet: '',
      exchange: ''
    },
    'Eman Token 2': {
      wallet: '',
      exchange: ''
    },
  };

  constructor(
    private financeService: FinanceService,
  ) { }

  async ngOnInit() {
    this.obmm = this.financeService.orderBookContract;
    await this.getBalances();
    // await this.getUserTrades(); // calls this.getAllTrades() internally
    await this.getAllTrades();  // calling this bc i have some values hardcoded in myTrades, temporary
    await this.getAllUserOpenOrders();
  }

  async getBalances() {
    const tokenBalances = await this.financeService.getUserTokenBalances();
    const addresses = [
      ethers.constants.AddressZero, // ETH
      this.financeService.emanToken1Contract.address, // Eman Token 1
      this.financeService.emanToken2Contract.address, // Eman Token 2
    ];
    const signer = await this.financeService.web3Service.signer.getAddress();
    this.balances = {
      'ETH': {
        wallet: this.parseToEther(await this.financeService.web3Service.signer.getBalance()),
        exchange: this.parseToEther(await this.obmm.tokens(addresses[0], signer)),
      },
      'Eman Token 1': {
        wallet: this.parseToEther(tokenBalances.emanToken1),
        exchange: this.parseToEther(await this.obmm.tokens(addresses[1], signer)),
      },
      'Eman Token 2': {
        wallet: this.parseToEther(tokenBalances.emanToken2),
        exchange: this.parseToEther(await this.obmm.tokens(addresses[2], signer)),
      },
    };
    console.log('Balances:', this.balances);
  }

  async import() {
    console.log('Importing tokens...');
    // add tokens to metamask
    try {
      await this.financeService.addTokensToWallet();
    } catch (error) {
      console.error('Failed to add tokens to wallet:', error);
      alert('Failed to add tokens to wallet. Please refresh page.');
    }
  }

  onActionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedAction = selectElement.value;
    console.log('Selected action:', this.selectedAction);
  }

  onAssetChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedAsset = selectElement.value;
    console.log('Selected asset:', this.selectedAsset);
  }

  parseToEther(wei: ethers.BigNumber): string {
    const formatted = ethers.utils.formatEther(wei);
    const [whole, decimals] = formatted.split('.');
    return decimals ? whole + '.' + decimals.slice(0, 4) : whole;
  }

  async onSubmitDepositWithdraw(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.assetAmount || isNaN(Number(this.assetAmount))) {
      alert('Please enter a valid numeric amount.');
      return;
    }
    const amountWei = ethers.utils.parseEther(this.assetAmount);
    try {
      if (this.selectedAction === 'Deposit') {
        if (this.selectedAsset === 'ETH') {
          // Deposit Ether: call depositEther with value
          const tx = await this.obmm.depositEther({ value: amountWei });
          await tx.wait();
          this.statusMessage = 'Deposit of ETH successful.';
        } else if (this.selectedAsset === 'Eman Token 1') {
          const tokenAddress = this.financeService.emanToken1Contract.address;
          // Approve token deposit first
          const approveTx = await this.financeService.emanToken1Contract.approve(this.obmm.address, amountWei);
          await approveTx.wait();
          // Now deposit the token
          const tx = await this.obmm.depositToken(tokenAddress, amountWei);
          await tx.wait();
          this.statusMessage = 'Deposit of Eman Token 1 successful.';
        } else if (this.selectedAsset === 'Eman Token 2') {
          const tokenAddress = this.financeService.emanToken2Contract.address;
          // Approve token deposit first
          const approveTx = await this.financeService.emanToken2Contract.approve(this.obmm.address, amountWei);
          await approveTx.wait();
          // Now deposit the token
          const tx = await this.obmm.depositToken(tokenAddress, amountWei);
          await tx.wait();
          this.statusMessage = 'Deposit of Eman Token 2 successful.';
        }
      } else if (this.selectedAction === 'Withdraw') {
        if (this.selectedAsset === 'ETH') {
          const tx = await this.obmm.withdrawEther(amountWei);
          await tx.wait();
          this.statusMessage = 'Withdrawal of ETH successful.';
        } else if (this.selectedAsset === 'Eman Token 1') {
          const tokenAddress = this.financeService.emanToken1Contract.address;
          const tx = await this.obmm.withdrawToken(tokenAddress, amountWei);
          await tx.wait();
          this.statusMessage = 'Withdrawal of Eman Token 1 successful.';
        } else if (this.selectedAsset === 'Eman Token 2') {
          const tokenAddress = this.financeService.emanToken2Contract.address;
          const tx = await this.obmm.withdrawToken(tokenAddress, amountWei);
          await tx.wait();
          this.statusMessage = 'Withdrawal of Eman Token 2 successful.';
        }
      }
      console.log(this.statusMessage);
      await this.getBalances(); // Refresh balances after the transaction
      this.assetAmount = ''; // Clear the input field
    } catch (error) {
      console.error('Error executing deposit/withdraw:', error);
      alert('Error executing action. Check console for details.');
    }
  }

  async makeOrder(event: Event): Promise<void> {
    event.preventDefault();

    // Get the select and input elements by their IDs.
    const assetFromSelect = document.querySelector('#assetFromExchange') as HTMLSelectElement;
    const assetFromAmountInput = document.querySelector('#assetFromExchangeAmount') as HTMLInputElement;
    const assetToSelect = document.querySelector('#assetToExchange') as HTMLSelectElement;
    const assetToAmountInput = document.querySelector('#assetToExchangeAmount') as HTMLInputElement;

    // Retrieve the values.
    const assetFrom = assetFromSelect.value; // Asset to receive (tokenGet)
    const assetFromAmount = assetFromAmountInput.value;
    const assetTo = assetToSelect.value;       // Asset to swap (tokenGive)
    const assetToAmount = assetToAmountInput.value;

    // Validate numeric input for amounts.
    if (isNaN(Number(assetFromAmount)) || isNaN(Number(assetToAmount))) {
      alert("Please enter valid numeric amounts for both fields.");
      return;
    }

    // Validate that the user is not swapping the same asset.
    if (assetFrom === assetTo) {
      alert("You cannot swap the same asset with itself.");
      return;
    }

    // Convert amounts (entered in Ether) to wei.
    const amountGetWei = ethers.utils.parseEther(assetFromAmount);
    const amountGiveWei = ethers.utils.parseEther(assetToAmount);

    // Map the asset names to token addresses.
    let tokenGetAddress: string;
    if (assetFrom === "ETH") {
      tokenGetAddress = ethers.constants.AddressZero;
    } else if (assetFrom === "Eman Token 1") {
      tokenGetAddress = this.financeService.emanToken1Contract.address;
    } else if (assetFrom === "Eman Token 2") {
      tokenGetAddress = this.financeService.emanToken2Contract.address;
    } else {
      alert("Invalid asset selected for receiving.");
      return;
    }

    let tokenGiveAddress: string;
    if (assetTo === "ETH") {
      tokenGiveAddress = ethers.constants.AddressZero;
    } else if (assetTo === "Eman Token 1") {
      tokenGiveAddress = this.financeService.emanToken1Contract.address;
    } else if (assetTo === "Eman Token 2") {
      tokenGiveAddress = this.financeService.emanToken2Contract.address;
    } else {
      alert("Invalid asset selected for swapping.");
      return;
    }

    // Log the next order number (for debugging).
    const nextOrderNumber = (await this.obmm.orderCount()).add(1).toString();
    console.log("Attempting to make order", nextOrderNumber);

    try {
      // Call the smart contract's makeOrder function.
      const tx = await this.obmm.makeOrder(
        tokenGetAddress,
        amountGetWei,
        tokenGiveAddress,
        amountGiveWei
      );
      await tx.wait();
      console.log("Order successfully made.");

      // Create a mapping to convert asset names to canonical symbols.
      const canonicalMap: { [key: string]: string } = {
        "ETH": "ETH",
        "Eman Token 1": "EMAN1",
        "Eman Token 2": "EMAN2"
      };

      // Push the new order to myOpenOrders using canonical names and include the order id.
      this.myOpenOrders.unshift({
        id: nextOrderNumber,
        token: canonicalMap[assetFrom] || assetFrom,
        pair: `${canonicalMap[assetFrom] || assetFrom}/${canonicalMap[assetTo] || assetTo}`,
        amount: assetFromAmount
      });

      // Reset all values.
      assetFromSelect.value = 'ETH';
      assetFromAmountInput.value = '';
      assetToSelect.value = 'Eman Token 1';
      assetToAmountInput.value = '';
    } catch (error) {
      console.error("Error making order:", error);
      alert("Error making order. Check console for details.");
    }
  }



  async getAllTrades() {
    try {
      // Query all past 'Trade' events from the OBMM contract.
      const trades = await this.obmm.queryFilter(this.obmm.filters.Trade());

      // Map the raw events into display-friendly objects.
      this.allTrades = trades.map(trade => {
        const args = trade.args;

        // Convert amounts from wei to ether numbers.
        const amountGet = Number(ethers.utils.formatEther(args.amountGet));
        const amountGive = Number(ethers.utils.formatEther(args.amountGive));

        // Map token addresses to symbols.
        const ethAddress = ethers.constants.AddressZero.toLowerCase();
        const eman1Address = this.financeService.emanToken1Contract.address.toLowerCase();
        const eman2Address = this.financeService.emanToken2Contract.address.toLowerCase();

        let tokenGetSymbol = (args.tokenGet.toLowerCase() === ethAddress)
          ? "ETH"
          : (args.tokenGet.toLowerCase() === eman1Address)
            ? "EMAN1"
            : (args.tokenGet.toLowerCase() === eman2Address)
              ? "EMAN2"
              : args.tokenGet.substring(0, 6) + '...';

        let tokenGiveSymbol = (args.tokenGive.toLowerCase() === ethAddress)
          ? "ETH"
          : (args.tokenGive.toLowerCase() === eman1Address)
            ? "EMAN1"
            : (args.tokenGive.toLowerCase() === eman2Address)
              ? "EMAN2"
              : args.tokenGive.substring(0, 6) + '...';

        // Define canonical order using fixed priority: ETH < EMAN1 < EMAN2.
        const orderPriority = { "ETH": 1, "EMAN1": 2, "EMAN2": 3 };
        let canonicalPair: string;
        let price: number;

        if (tokenGetSymbol !== tokenGiveSymbol &&
          orderPriority[tokenGetSymbol] && orderPriority[tokenGiveSymbol]) {
          if (orderPriority[tokenGetSymbol] < orderPriority[tokenGiveSymbol]) {
            // Already in canonical order.
            canonicalPair = `${tokenGetSymbol}/${tokenGiveSymbol}`;
            price = amountGive !== 0 ? amountGet / amountGive : 0;
          } else {
            // Reversed order: swap for display and invert the ratio.
            canonicalPair = `${tokenGiveSymbol}/${tokenGetSymbol}`;
            price = amountGet !== 0 ? amountGive / amountGet : 0;
          }
        } else {
          canonicalPair = `${tokenGetSymbol}/${tokenGiveSymbol}`;
          price = amountGive !== 0 ? amountGet / amountGive : 0;
        }

        // Determine display color based on canonical pair and the token given away.
        // For our canonical order, if the order maker gave away the first token, that means they sold it → red.
        // Otherwise (if they gave away the second token), it means they're buying the first token → green.
        const canonicalTokens = canonicalPair.split('/');
        const canonicalToken1 = canonicalTokens[0];
        let color: string;
        if (tokenGiveSymbol === canonicalToken1) {
          color = 'var(--danger)'; // e.g., red (#dc3545)
        } else {
          color = 'var(--success)'; // e.g., green (#28a745)
        }

        // Format the timestamp as a human-readable date.
        const timestamp = new Date(args.timestamp.toNumber() * 1000).toLocaleString();

        return {
          time: timestamp,
          token: tokenGetSymbol,
          pair: canonicalPair,
          price: price.toFixed(4),
          color
        };
      }).reverse(); // Reverse the order to show most recent trades first.

      console.log('All Trades:', this.allTrades);
      return trades;
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  }

  async getUserTrades(): Promise<void> {
    try {
      // Query all past 'Trade' events from the OBMM contract.
      const trades = await this.getAllTrades();

      // Get the current user's address (lowercase for safe comparison)
      const currentUser = (await this.financeService.web3Service.signer.getAddress()).toLowerCase();

      // Filter for only trades where the user is involved.
      const userTrades = trades.filter(trade => {
        const args = trade.args;
        return (args.user && args.user.toLowerCase() === currentUser) ||
          (args.userFill && args.userFill.toLowerCase() === currentUser);
      });

      // Map filtered trades into display-friendly objects.
      this.myTrades = userTrades.map(trade => {
        const args = trade.args;

        // Convert amounts from wei to ether numbers (assume 18 decimals).
        const amountGet = Number(ethers.utils.formatEther(args.amountGet));
        const amountGive = Number(ethers.utils.formatEther(args.amountGive));

        // Map token addresses to friendly symbols.
        const ethAddress = ethers.constants.AddressZero.toLowerCase();
        const eman1Address = this.financeService.emanToken1Contract.address.toLowerCase();
        const eman2Address = this.financeService.emanToken2Contract.address.toLowerCase();

        const tokenGetSymbol = (args.tokenGet.toLowerCase() === ethAddress)
          ? "ETH"
          : (args.tokenGet.toLowerCase() === eman1Address)
            ? "EMAN1"
            : (args.tokenGet.toLowerCase() === eman2Address)
              ? "EMAN2"
              : args.tokenGet.substring(0, 6) + '...';

        const tokenGiveSymbol = (args.tokenGive.toLowerCase() === ethAddress)
          ? "ETH"
          : (args.tokenGive.toLowerCase() === eman1Address)
            ? "EMAN1"
            : (args.tokenGive.toLowerCase() === eman2Address)
              ? "EMAN2"
              : args.tokenGive.substring(0, 6) + '...';

        // Determine canonical pair order (using fixed priority: ETH < EMAN1 < EMAN2).
        const orderPriority = { "ETH": 1, "EMAN1": 2, "EMAN2": 3 };
        let canonicalPair: string;
        if (tokenGetSymbol !== tokenGiveSymbol &&
          orderPriority[tokenGetSymbol] && orderPriority[tokenGiveSymbol]) {
          if (orderPriority[tokenGetSymbol] < orderPriority[tokenGiveSymbol]) {
            canonicalPair = `${tokenGetSymbol}/${tokenGiveSymbol}`;
          } else {
            canonicalPair = `${tokenGiveSymbol}/${tokenGetSymbol}`;
          }
        } else {
          canonicalPair = `${tokenGetSymbol}/${tokenGiveSymbol}`;
        }

        // Determine which token the user received:
        // If the user is the order maker, they receive tokenGet; if the user is the filler, they receive tokenGive.
        let tokenReceived: string;
        let amountReceived: number;
        if (args.user && args.user.toLowerCase() === currentUser) {
          tokenReceived = tokenGetSymbol;
          amountReceived = amountGet;
        } else if (args.userFill && args.userFill.toLowerCase() === currentUser) {
          tokenReceived = tokenGiveSymbol;
          amountReceived = amountGive;
        } else {
          tokenReceived = "N/A";
          amountReceived = 0;
        }

        // Format the timestamp as a human-readable date.
        const timestamp = new Date(args.timestamp.toNumber() * 1000).toLocaleString();

        return {
          time: timestamp,
          token: tokenReceived,
          pair: canonicalPair,
          amount: amountReceived.toFixed(4)
        };
      }).reverse(); // Reverse the order to show most recent trades first.

      console.log("My Trades:", this.myTrades);
    } catch (error) {
      console.error("Error fetching my trades:", error);
    }
  }

  async getAllUserOpenOrders(): Promise<void> {
    try {
      // Query all past 'Order' events from the OBMM contract.
      const orderEvents = await this.obmm.queryFilter(this.obmm.filters.Order());

      // Get the current user's address (lowercase for safe comparison).
      const currentUser = (await this.financeService.web3Service.signer.getAddress()).toLowerCase();

      // Filter events where the order maker is the current user.
      const userOrders = orderEvents.filter(event => {
        return event.args && event.args.user && event.args.user.toLowerCase() === currentUser;
      });

      // Map the user orders into display objects, checking cancellation and filled status.
      const openOrdersPromises = userOrders.map(async event => {
        const orderId = event.args.id; // order id (BigNumber)

        // Check if the order is cancelled or filled.
        const isCancelled = await this.obmm.orderCancelled(orderId);
        const isFilled = await this.obmm.orderFilled(orderId);

        if (!isCancelled && !isFilled) {
          // Map token addresses to friendly symbols.
          const ethAddress = ethers.constants.AddressZero.toLowerCase();
          const eman1Address = this.financeService.emanToken1Contract.address.toLowerCase();
          const eman2Address = this.financeService.emanToken2Contract.address.toLowerCase();

          let tokenGetSymbol = (event.args.tokenGet.toLowerCase() === ethAddress)
            ? "ETH"
            : (event.args.tokenGet.toLowerCase() === eman1Address)
              ? "EMAN1"
              : (event.args.tokenGet.toLowerCase() === eman2Address)
                ? "EMAN2"
                : event.args.tokenGet.substring(0, 6) + '...';

          let tokenGiveSymbol = (event.args.tokenGive.toLowerCase() === ethAddress)
            ? "ETH"
            : (event.args.tokenGive.toLowerCase() === eman1Address)
              ? "EMAN1"
              : (event.args.tokenGive.toLowerCase() === eman2Address)
                ? "EMAN2"
                : event.args.tokenGive.substring(0, 6) + '...';

          // Determine canonical pair using fixed priority: ETH < EMAN1 < EMAN2.
          const orderPriority = { "ETH": 1, "EMAN1": 2, "EMAN2": 3 };
          let canonicalPair: string;
          if (tokenGetSymbol !== tokenGiveSymbol &&
            orderPriority[tokenGetSymbol] && orderPriority[tokenGiveSymbol]) {
            if (orderPriority[tokenGetSymbol] < orderPriority[tokenGiveSymbol]) {
              canonicalPair = `${tokenGetSymbol}/${tokenGiveSymbol}`;
            } else {
              canonicalPair = `${tokenGiveSymbol}/${tokenGetSymbol}`;
            }
          } else {
            canonicalPair = `${tokenGetSymbol}/${tokenGiveSymbol}`;
          }

          // Format the amount the user is set to receive (amountGet).
          const amountReceived = ethers.utils.formatEther(event.args.amountGet);

          return {
            id: orderId.toString(),
            token: tokenGetSymbol,
            pair: canonicalPair,
            amount: amountReceived
          };
        } else {
          return null;
        }
      });

      const openOrders = await Promise.all(openOrdersPromises);
      // Filter out null entries.
      this.myOpenOrders = openOrders.filter(order => order !== null).reverse(); // Show most recent orders first.
      console.log("My Open Orders:", this.myOpenOrders);
    } catch (error) {
      console.error("Error fetching user open orders:", error);
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    // id should a number so make sure it !NaN
    if (isNaN(Number(orderId))) {
      alert('Invalid order ID.');
      return;
    }

    try {
      const tx = await this.obmm.cancelOrder(orderId);
      await tx.wait();
      console.log('Order cancelled successfully.');
      // remove it from the array by filtering it out
      this.myOpenOrders = this.myOpenOrders.filter(order => order.id !== orderId);
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Error cancelling order. Check console for details.');
    }
  }

}
