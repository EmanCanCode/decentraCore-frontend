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
  escrowLifeCycleState?: "No Earnest Deposited" | "Earned Deposited";
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
