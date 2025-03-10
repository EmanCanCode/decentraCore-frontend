// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  financeContracts: {
    "Eman Token 1": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "Eman Token 2": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    CPAMM: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    CSAMM: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    OBMM: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  },
  supplyChainContract: {
    automatedProcess: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    inventoryManagement: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    provenance: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
  },
  realEstateContracts: {
    realEstate: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
    escrowFactory: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
    mortgageFinance: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
  },
  seederAddresses: {
    seeder1: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    seeder2: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    seeder3: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    seeder4: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    seeder5: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
  },
  web3: {
    rpcUrl: "http://127.0.0.1:8545/",
    chainIdHex: "0x7A69",
    chainName: "Hardhat Playground",
    blockExplorer: "http://127.0.0.1:1234"
  },
  api: 'http://localhost:3000',
  escrowManager: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
