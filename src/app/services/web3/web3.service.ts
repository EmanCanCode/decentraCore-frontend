import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from '../../../environments/environment';
import * as realEstateContractBuild from '../../blockchain/abis/realEstate/RealEstate.sol/RealEstate.json';
import * as realEstateFinanceContractBuild from '../../blockchain/abis/realEstate/Finance.sol/Finance.json';
import * as realEstateEscrowFactoryContractBuild from '../../blockchain/abis/realEstate/EscrowFactory.sol/EscrowFactory.json';
import * as realEstateEscrowContractBuild from '../../blockchain/abis/realEstate/Escrow.sol/Escrow.json';
import { UserRealEstateLifeCycle } from '../../interfaces/interfaces';
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
    private router: Router,
  ) {
    this.detectWallet();
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

  async connect() {
    if (!window.ethereum) {
      console.error('No Ethereum provider found');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      console.log('User connected to wallet');
      this.isConnected = true;
      this.signer = this.provider?.getSigner() ?? null;
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
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

    const chainIdHex = environment.web3.chainIdHex;

    try {
      // Step 1: Try to switch
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      console.log('Successfully switched to chain:', chainIdHex);
    } catch (switchError: any) {
      // Step 2: If the chain is not added, then try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: environment.web3.chainName,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [environment.web3.rpcUrl.replace(/\/$/, '')],
                // blockExplorerUrls: [environment.web3.blockExplorer.replace(/\/$/, '')], // optional
              },
            ],
          });
          console.log('Successfully added and switched to chain:', chainIdHex);
        } catch (addError) {
          console.error('Failed to add the chain:', addError);
        }
      } else {
        console.error('Failed to switch chain:', switchError);
      }
    }
  }


  async onNetworkChange() {
    if (!window.ethereum) {
      console.error('No Ethereum provider found');
      return;
    }

    window.ethereum.on('chainChanged', async (chainId: string) => {
      console.log('Chain changed to:', chainId);
      await this.addAndSwitchChain().catch(async () => {
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
      await this.provider?.send('eth_accounts', []);
      this.signer = this.provider?.getSigner() ?? null;
    });
  }

  getSigner() {
    if (!this.provider) {
      console.error('No provider found');
      throw new Error('No provider found');
    } else if (!this.signer) {
      // try to connect to the wallet and get the signer
      this.detectWallet().then(() => {
        if (!this.signer) {
          console.error('No signer found');
          throw new Error('No signer found');
        }
      });

    } else if (!this.isConnected) {
      console.error('No wallet connected');
      throw new Error('No wallet connected');
    }
    return this.signer!;
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
    console.log("getting user real estate life cycle state...");
    // initialize as if the user has no property, this is the default state (safe)
    let userRealEstateLifeCycleState: UserRealEstateLifeCycle = { state: 'noProperty' };

    // get contract and signer address
    const contract = await this.getRealEstateContract();
    const signerAddress = await this.signer.getAddress();

    // guard clauses with early "returns"
    if (!contract) {
      console.log('No contract found');
      throw new Error('No contract found');
    }

    if (!signerAddress) {
      console.log('No signer address found');
      throw new Error('No signer address found');
    }

    // Check ERC-1155 ownership
    let ownsProperty = false;
    // loop through properties 1-9 and check if the user owns any
    // there is a possibility that the user owns multiple properties, so we will return the first one found... who cares. they should only own one anyways.
    for (let i = 1; i <= 9; i++) {
      // template was built in node 16 so i cant use typechain the way i want to so i am type casting the balanceOf function to ethers.BigNumber, since the contracts do not have a typechain generated file (basic ERC-1155 eww....)
      const balance: ethers.BigNumber = await contract.balanceOf(signerAddress, i);
      // if they have a balance > 0, they own the property
      if (balance.gt(0)) {
        // set flag to true and set userRealEstateLifeCycleState
        ownsProperty = true;
        console.log('Owns property:', i);
        userRealEstateLifeCycleState = {
          state: 'ownsProperty',
          propertyId: i
        };

        // break the loop since we only care about the first property they own
        break;
      }
    }

    // return userRealEstateLifeCycleState if the user owns a property
    if (ownsProperty) {
      return userRealEstateLifeCycleState;
    }

    // Check if in escrow by awaiting the ajax call (i hate this template, but it is what it is... i would obv use the angular http client module not this jQuery ajax call bullcrap.)
    let inEscrow = false;
    try {
      const { propertyId, escrowAddress } = await this.checkEscrow(signerAddress);
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
    const financeContract = this.realEstateFinanceContract;
    const idInFinance: ethers.BigNumber = await financeContract.idInFinance(signerAddress);
    if (idInFinance.gt(0)) {
      userRealEstateLifeCycleState = {
        state: 'inFinanceContract',
        propertyId: idInFinance.toNumber()
      };
    }
    return userRealEstateLifeCycleState;

  }

  private async checkEscrow(signerAddress: string): Promise<{
    propertyId: number,
    escrowAddress: string
  }> {
    return new Promise((resolve, reject) => {
      if (!this.signer) {
        console.error('No signer found');
        return reject('No signer found');
      }
      console.log("checking to see if in escrow");
      $.ajax({
        url: `${environment.api}/api/realEstate/${signerAddress}`,
        type: 'GET',
        success: async (response: { escrowId: string }) => {
          console.log('Escrow ID:', response.escrowId);
          // create escrow factory instance call the escrows function pass in the escrow id for the escrow contract address
          const factory = new ethers.Contract(
            environment.realEstateContracts.escrowFactory,
            realEstateEscrowFactoryContractBuild.abi,
            this.signer!
          );
          const escrowAddress: string = await factory.escrows(response.escrowId);
          // create escrow contract instance, get propertyId from state variable of the smart contract
          const escrowContract = this.getEscrowContract(escrowAddress);

          const propertyId: ethers.BigNumber = await escrowContract.nft_id();
          resolve({ propertyId: propertyId.toNumber(), escrowAddress });
        },
        error: (error) => {
          console.error('Error checking escrow:', error); ``
          reject(error);
        }
      });
    });
  }

  async getEscrowLifeCycleState(
    escrowAddress: string
  ): Promise<"No Earnest Deposited" | "Earnest Deposited"> {
    if (!this.signer) {
      console.error('No signer found');
      throw new Error('No signer found');
    }

    const escrowContract = this.getEscrowContract(escrowAddress);
    const userAddress = await this.signer.getAddress();

    // 1) First, try to find any Deposit events for this user
    //    We listen from block 0, but you can narrow it if you know the deployment block.
    const filter = escrowContract.filters.Deposit(userAddress, null);
    const events = await escrowContract.queryFilter(filter, 0, 'latest');

    if (events.length > 0) {
      console.log(`Found ${events.length} Deposit event(s) for ${userAddress}`);
      return "Earnest Deposited";
    }

    // 2) Fallback: if no events, you can still do the balance check if you want
    try {
      const buyerDepositAmount: ethers.BigNumber = await escrowContract.deposit_balance(userAddress);
      console.log('Buyer deposit amount:', buyerDepositAmount.toString());
      if (buyerDepositAmount.gt(0)) {
        return "Earnest Deposited";
      }
    } catch (err) {
      console.warn('Balance lookup failed, relying on events only', err);
    }

    return "No Earnest Deposited";
  }


  getEscrowContract(escrowAddress: string): ethers.Contract {
    if (!this.signer) {
      console.error('No signer found');
      throw new Error('No signer found');
    }
    return new ethers.Contract(
      escrowAddress,
      realEstateEscrowContractBuild.abi,
      this.signer
    );
  }

  getEscrowFactoryContract(): ethers.Contract {
    if (!this.signer) {
      console.error('No signer found');
      throw new Error('No signer found');
    }
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
        seller,
        buyer,
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
      const signature = await this.signer?.signMessage(ethers.utils.arrayify(messageDigest));
      if (!signature) {
        throw new Error('No signature found');
      }
      return signature;
    } catch (err) {
      console.error('Failed to sign message:', err);
      throw err;
    }
  }

  // api/blockchain/faucet
  requestFaucet() {
    return new Promise(async (resolve, reject) => {
      if (!this.signer) {
        console.error('No signer found');
        return;
      }

      const data = {
        address: await this.signer.getAddress()
      };

      $.ajax({
        url: `${environment.api}/api/blockchain/faucet`,
        type: 'GET',
        data,
        success: (response) => {
          console.log('Faucet request successful:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error requesting faucet:', error);
          reject(error);
        }
      });
    });
  }

  get realEstateFinanceContract() {
    if (!this.signer) {
      this.signer = this.getSigner();
    }
    return new ethers.Contract(
      environment.realEstateContracts.mortgageFinance,
      realEstateFinanceContractBuild.abi,
      this.signer
    );
  }
}
