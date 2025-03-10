import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import * as realEstateContractBuild from '../../blockchain/abis/realEstate/RealEstate.sol/RealEstate.json';
import * as realEstateFinanceContractBuild from '../../blockchain/abis/realEstate/Finance.sol/Finance.json';
import * as realEstateEscrowFactoryContractBuild from '../../blockchain/abis/realEstate/EscrowFactory.sol/EscrowFactory.json';
import * as realEstateEscrowContractBuild from '../../blockchain/abis/realEstate/Escrow.sol/Escrow.json';
import { UserRealEstateLifeCycle } from 'src/app/interfaces/interfaces';
import $ from 'jquery';
import { Router } from '@angular/router';


declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private isConnected = false;
  signer: ethers.Signer | null = null;

  constructor(
    private router: Router
  ) {
    this.onNetworkChange();
    this.onAccountChange();
  }

  // connecting to the wallet and switching to the custom chain

  async detectWallet(): Promise<void> {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log('Web3 wallet (MetaMask) detected.');
      // Optionally, you can try connecting automatically:
      try {
        await this.provider.send('eth_requestAccounts', []);
        this.isConnected = true;
        this.signer = this.provider.getSigner();
        console.log('Web3 wallet connected.');
        console.log('Connected address:', await this.signer.getAddress());
      } catch (err) {
        console.error('Web3 wallet detected but not connected.');
        this.isConnected = false
      }
    } else {
      console.error('No Web3 wallet installed.');
      this.isConnected = false;
    }
  }

  getProvider(): ethers.providers.Web3Provider | null {
    return this.provider;
  }

  isWalletConnected(): boolean {
    return this.isConnected;
  }

  async addAndSwitchChain() {
    if (!window.ethereum) {
      console.error('No Ethereum provider found');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: environment.web3.chainIdHex,
            chainName: environment.web3.chainName,
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: [environment.web3.rpcUrl],
            blockExplorerUrls: [environment.web3.blockExplorer],
          },
        ],
      });

      console.log('User added/switched to custom chain:', environment.web3.chainName);
    } catch (error) {
      console.error('Failed to add/switch chain:', error);
    }
  }

  async onNetworkChange() {
    if (!window.ethereum) {
      console.error('No Ethereum provider found');
      return;
    }

    window.ethereum.on('chainChanged', async (chainId: string) => {
      console.log('Chain changed to:', chainId);
      await this.addAndSwitchChain().catch(() => {
        // we need to alert them to switch to the correct network, send them to homepage
        alert('Please switch to the correct network');
        this.router.navigate(['/']);
      });
    });
  }

  async onAccountChange() {
    if (!window.ethereum) {
      console.error('No Ethereum provider found');
      return;
    }

    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      console.log('Account changed to:', accounts[0]);
      await this.provider.send('eth_accounts', []);
      this.signer = this.provider.getSigner();
    });
  }

  // real estate
  async getRealEstateContract(): Promise<ethers.Contract | null> {
    if (!this.provider) {
      console.error('No provider found');
      return null;
    } else if (!this.signer) {
      console.error('No signer found');
      return null;
    }

    return new ethers.Contract(
      environment.realEstateContracts.realEstate,
      realEstateContractBuild.abi,
      this.signer
    );
  }

  async userRealEstateLifeCycle(): Promise<UserRealEstateLifeCycle> {
    let userRealEstateLifeCycleState: UserRealEstateLifeCycle;
    const contract = await this.getRealEstateContract();
    let ownsProperty = false;

    // Check ERC-1155 ownership
    for (let i = 1; i <= 9; i++) {
      const balance: ethers.BigNumber = await contract.balanceOf(await this.signer.getAddress(), i);
      if (balance.gt(0)) {
        ownsProperty = true;
        userRealEstateLifeCycleState = {
          state: 'ownsProperty',
          propertyId: i
        };
        break;
      }
    }

    if (ownsProperty) {
      return userRealEstateLifeCycleState;
    }

    // Check if in escrow by awaiting the ajax call
    let inEscrow = false;
    try {
      const { propertyId, escrowAddress } = await this.checkEscrow(await this.signer.getAddress());
      console.log('In escrow, propertyId:', propertyId);
      inEscrow = true;
      // set userRealEstateLifeCycleState.escrowLifeCycleState
      userRealEstateLifeCycleState = {
        state: 'inEscrow',
        propertyId,
        escrowAddress,
        escrowLifeCycleState: await this.getEscrowLifeCycleState(escrowAddress)
      };

    } catch (error) {
      console.log("Not in escrow");
    }

    if (inEscrow) {
      return userRealEstateLifeCycleState;
    }

    // Check if property is in finance contract
    const financeContract = new ethers.Contract(
      environment.realEstateContracts.mortgageFinance,
      realEstateFinanceContractBuild.abi,
      this.signer
    );
    const idInFinance: ethers.BigNumber = await financeContract.idInFinance(await this.signer.getAddress());
    if (idInFinance.gt(0)) {
      userRealEstateLifeCycleState = {
        state: 'inFinanceContract',
        propertyId: idInFinance.toNumber()
      };
      return userRealEstateLifeCycleState;
    } else {
      return {
        state: 'noProperty'
      };
    }

  }

  private async checkEscrow(signerAddress: string): Promise<{
    propertyId: number,
    escrowAddress: string
  }> {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `${environment.api}/api/realEstate/${signerAddress}`,
        type: 'GET',
        success: async (response: { escrowId: string }) => {
          // create escrow factory instance call the escrows function pass in the escrow id for the escrow contract address
          const factory = new ethers.Contract(
            environment.realEstateContracts.escrowFactory,
            realEstateEscrowFactoryContractBuild.abi,
            this.signer
          );
          const escrowAddress: string = await factory.escrows(response.escrowId);
          // create escrow contract instance, get propertyId from state variable of the smart contract
          const escrowContract = this.getEscrowContract(escrowAddress);

          const propertyId: ethers.BigNumber = await escrowContract.nft_id();
          resolve({ propertyId: propertyId.toNumber(), escrowAddress });
        },
        error: (error) => reject(error)
      });
    });
  }

  async getEscrowLifeCycleState(
    escrowAddress: string
  ): Promise<
    "No Earnest Deposited" | "Earned Deposited"
  > {
    const escrowContract = this.getEscrowContract(escrowAddress);

    // determine earnest value === buyer deposits
    const buyerDepositAmount: ethers.BigNumber = await escrowContract.deposit_balance(
      await this.signer.getAddress()
    );

    if (
      buyerDepositAmount.eq(
        await escrowContract.earnest_amount() as ethers.BigNumber
      ) || buyerDepositAmount.gt(0) // the contract says the buyer must deposit the exact amount as the earnest, but putting this here as a failsafe
    ) {
      return "Earned Deposited";
    } else {
      return "No Earnest Deposited";
    }
  }

  getEscrowContract(escrowAddress: string): ethers.Contract {
    return new ethers.Contract(
      escrowAddress,
      realEstateEscrowContractBuild.abi,
      this.signer
    );
  }

  getEscrowFactoryContract(): ethers.Contract {
    return new ethers.Contract(
      environment.realEstateContracts.escrowFactory,
      realEstateEscrowFactoryContractBuild.abi,
      this.signer
    );
  }

  async createEscrowSignatureDigest(
    nftId: number,
    purchasePrice: ethers.BigNumber,
    seller: string,
    buyer: string,
  ) {
    const escrowManager = environment.escrowManager;
    const factory = this.getEscrowFactoryContract();
    const nonce: ethers.BigNumber = await factory.nonce(buyer, seller);

    let messageDigest = ethers.utils.solidityPack(
      [
        'address', // nft address
        'uint256', // nft id
        'uint8', // nft count
        'uint256', // purchase price
        'uint256', // earnest amount
        'address', // seller
        'address', // buyer
        'address', // inspector
        'address', // lender
        'address', // appraiser
        'uint256' // nonce
      ],
      [
        environment.realEstateContracts.realEstate,
        nftId,
        1,
        purchasePrice,
        purchasePrice.div(100), // earnest amount is 1% of purchase price
        buyer,
        seller,
        escrowManager,
        escrowManager,
        escrowManager,
        nonce.add(1)
      ]
    );

    messageDigest = ethers.utils.solidityKeccak256(['bytes'], [messageDigest]);
    return messageDigest;
  }

  async signMessage(messageDigest: string): Promise<string> {
    try {
      const signature = await this.signer.signMessage(ethers.utils.arrayify(messageDigest));
      return signature;
    } catch (err) {
      console.error('Failed to sign message:', err);
    }
  }
}
