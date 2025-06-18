import { Injectable } from '@angular/core';
import { Web3Service } from '../web3/web3.service';
import { ethers } from 'ethers';
import * as provenanceContractBuild from '../../blockchain/abis/supplyChain/Provenance.sol/Provenance.json';
import * as inventoryManagementContractBuild from '../../blockchain/abis/supplyChain/InventoryManagement.sol/InventoryManagement.json';
import { environment } from '../../../environments/environment';
import { ProductRecord } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService {

  constructor(
    private web3Service: Web3Service,
  ) { }

  get inventoryManagementContract() {
    if (!this.web3Service.signer) {
      console.log('No signer found');
      throw new Error('No signer found');
    }
    return new ethers.Contract(
      environment.supplyChainContract.inventoryManagement,
      inventoryManagementContractBuild.abi,
      this.web3Service.getSigner()
    );
  }

  get provenanceContract() {
    return new ethers.Contract(
      environment.supplyChainContract.provenance,
      provenanceContractBuild.abi,
      this.web3Service.getSigner()
    );
  }

  isFirstTimeBuyer(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const productHistory = await this.userProductHistory();
        return resolve(productHistory === 'No Product History');
      } catch (err) {
        console.error(err);
        return reject(err);
      }
    });
  }

  async userProductHistory() {
    // get product id
    const productId = ethers.utils.solidityPack(
      [
        'address', // address
        'uint32' // nonce
      ],
      [
        await this.web3Service.signer.getAddress(), // address
        1 // will be 1 since i will only allow them to have one product at a time
      ]
    );

    // see if they have a product record in the productHistory mapping
    const productHistory: ProductRecord[] = await this.provenanceContract.getHistory(productId);
    if (!productHistory.length) {  // no product history
      return 'No Product History';
    }

    return productHistory;
  }


}
