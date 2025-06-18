import { ethers } from "ethers";

export interface RealEstateMetadata {
  name: string,
  description: string,
  image: string,
  otherImages: string[],
  attributes: {
    Bedrooms: number,
    Bathrooms: number,
    SquareFeet: number,
    YearBuilt: number,
    Location: string,
    "Property Type": string
  }
}

export interface DisplayedProperty extends Pick<RealEstateMetadata, 'description' | 'image' | 'attributes'> {
  price: number;
  id: number;
  category: 'Single Family' | 'Multi-Family' | 'Luxury';
}

export interface UserRealEstateLifeCycle {
  state: 'ownsProperty' | 'inEscrow' | 'inFinanceContract' | 'noProperty';
  propertyId?: number;  // nft id
  escrowAddress?: string; // address of the escrow contract spawned by factory
  escrowLifeCycleState?: "No Earnest Deposited" | "Earnest Deposited";
}


export interface EscrowParams {
  nft_address: string;
  nft_id: number;
  nft_count: number;
  purchase_price: ethers.BigNumber;  // in ether specifically
  earnest_amount: ethers.BigNumber;
  seller: string;
  buyer: string;
  inspector: string;
  lender: string;
  appraiser: string;
}


export interface Item {
  name: string;
  description: string;
  quantity: ethers.BigNumber;
  reorderThreshold: ethers.BigNumber;
}

export interface ProductRecord {
  productName: string;
  variety: string;
  productType: string;
  timestamp: ethers.BigNumber;
  location: string;
  state: number;
  additionalInfo: string;
}


export interface FinanceSwapTokenItem {
  img: string;
  title: string;
  qty: number;
}

export type TokenTitle = 'Eman Token 1' | 'Eman Token 2';

export interface ObmmTradeRecord {
  time: string;
  token: string;
  pair: string;
  price: string;
  color: string;
}



export type FinanceType = 'CPAMM' | 'CSAMM' | 'OBMM';
export interface FinanceDocument {  // CPAMM, CSAMM AND OBMM will have this interface
    _id?: any;
    type: FinanceType;
    totalSwaps: number;
    totalVolume: number;
    totalFees: number;
    totalCancelled?: number; // for obmm
}
