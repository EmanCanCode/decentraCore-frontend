import { Injectable } from '@angular/core';
import { Web3Service } from '../web3/web3.service';
import { environment } from '../../../environments/environment';
import { ethers } from 'ethers';
import * as cpammContractBuild from '../../blockchain/abis/finance/ConstantProduct.sol/ConstantProduct.json';
import * as csammContractBuild from '../../blockchain/abis/finance/ConstantSum.sol/ConstantSum.json';
import * as obmmContractBuild from '../../blockchain/abis/finance/OrderBook.sol/OrderBook.json';
import * as fungibleTokenContractBuild from '../../blockchain/abis/finance/FungibleToken.sol/FungibleToken.json';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(
    public web3Service: Web3Service,
  ) {

  }

  get constantProductContract() {
    // get typechain "ConstantProduct" contract
    return new ethers.Contract(
      environment.financeContracts.CPAMM,
      cpammContractBuild.abi,
      this.web3Service.getSigner()
    );
  }

  get constantSumContract() {
    return new ethers.Contract(
      environment.financeContracts.CSAMM,
      csammContractBuild.abi,
      this.web3Service.getSigner()
    );
  }

  get orderBookContract() {
    return new ethers.Contract(
      environment.financeContracts.OBMM,
      obmmContractBuild.abi,
      this.web3Service.getSigner()
    );
  }

  get emanToken1Contract() {
    return new ethers.Contract(
      environment.financeContracts['Eman Token 1'],
      fungibleTokenContractBuild.abi,
      this.web3Service.getSigner()
    );
  }

  get emanToken2Contract() {
    return new ethers.Contract(
      environment.financeContracts['Eman Token 2'],
      fungibleTokenContractBuild.abi,
      this.web3Service.getSigner()
    );
  }

  async addTokensToWallet() {
    if (!window.ethereum) {
      console.error("Ethereum provider not found.");
      return;
    }

    try {
      const token1Address = environment.financeContracts['Eman Token 1'];
      const token2Address = environment.financeContracts['Eman Token 2'];
      const token1Symbol = "EMAN1";
      const token2Symbol = "EMAN2";
      const tokenDecimals = 18;
      const token1Image = environment.url + '/assets/img/web3/emanToken1.png';
      const token2Image = environment.url + '/assets/img/web3/emanToken2.png';

      // Prompt wallet to add token 1
      const wasAdded1 = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token1Address,
            symbol: token1Symbol,
            decimals: tokenDecimals,
            image: token1Image,
          },
        },
      });

      if (wasAdded1) {
        console.log(`${token1Symbol} successfully added to your wallet.`);
      } else {
        console.log(`${token1Symbol} was not added.`);
      }

      // Prompt wallet to add token 2
      const wasAdded2 = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token2Address,
            symbol: token2Symbol,
            decimals: tokenDecimals,
            image: token2Image,
          },
        },
      });

      if (wasAdded2) {
        console.log(`${token2Symbol} successfully added to your wallet.`);
      } else {
        console.log(`${token2Symbol} was not added.`);
      }
    } catch (error) {
      console.error("Error adding tokens to wallet:", error);
    }
  }

  async getReserves(
    amm: 'Constant Product' | 'Constant Sum'
  ): Promise<{ emanToken1: ethers.BigNumber, emanToken2: ethers.BigNumber }> {
    if (amm === 'Constant Product') {
      return {
        emanToken1: await this.constantProductContract.reserveA(),
        emanToken2: await this.constantProductContract.reserveB()
      };
    } else {
      return {
        emanToken1: await this.constantSumContract.reserveA(),
        emanToken2: await this.constantSumContract.reserveB()
      };
    }
  }

  async getUserLPTs(amm: 'Constant Product' | 'Constant Sum'): Promise<ethers.BigNumber> {
    if (amm === 'Constant Product') {
      return await this.constantProductContract.balanceOf(await this.web3Service.signer.getAddress());
    } else {
      return await this.constantSumContract.balanceOf(await this.web3Service.signer.getAddress());
    }
  }

  async getTotalLPTs(amm: 'Constant Product' | 'Constant Sum'): Promise<ethers.BigNumber> {
    if (amm === 'Constant Product') {
      return await this.constantProductContract.totalSupply();
    } else {
      return await this.constantSumContract.totalSupply();
    }
  }

  async getUserTokenBalances(): Promise<{ emanToken1: ethers.BigNumber, emanToken2: ethers.BigNumber }> {
    return {
      emanToken1: await this.emanToken1Contract.balanceOf(await this.web3Service.signer.getAddress()),
      emanToken2: await this.emanToken2Contract.balanceOf(await this.web3Service.signer.getAddress())
    };
  }

  async addLiquidity(
    amm: 'Constant Product' | 'Constant Sum',
    amountA: ethers.BigNumber,
    amountB: ethers.BigNumber
  ) {
    const contract = amm === 'Constant Product' ? this.constantProductContract : this.constantSumContract;
    try {
      // check approval for token A and see if it is approved
      let approvedAmount: ethers.BigNumber = await this.emanToken1Contract.allowance(
        await this.web3Service.signer.getAddress(),
        contract.address
      );
      if (approvedAmount.lt(amountA)) {
        const approveTx = await this.emanToken1Contract.approve(contract.address, amountA);
        await approveTx.wait();
      }

      // check approval for token B and see if it is approved
      approvedAmount = await this.emanToken2Contract.allowance(
        await this.web3Service.signer.getAddress(),
        contract.address
      );
      if (approvedAmount.lt(amountB)) {
        const approveTx = await this.emanToken2Contract.approve(contract.address, amountB);
        await approveTx.wait();
      }

      // add liquidity
      const addLiquidityTx = await contract.addLiquidity(amountA, amountB);
      await addLiquidityTx.wait();
      console.log('Liquidity added');

    } catch (err) {
      console.trace('Error adding liquidity:', err);
    }
  }

}
