// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  url: 'http://localhost:4200',
  production: false,
  financeContracts: {
  "Eman Token 1": "0x16491D937996B261C8Ca887372C8af3040c4fb41",
  "Eman Token 2": "0x1cdF3b421a54aBB7B174CFEC9561eF0F17b0E678",
  "CPAMM": "0x1Ba3499E20109FF4db497B75eB24a82D78d06C5C",
  "CSAMM": "0x5DE27D6Eaab8582cf611D0351Ad6d78413C8Dc74",
  "OBMM": "0x71a2cf6A69345ADf274be09f3773d4c484C78aF0"
},
  supplyChainContract: {
  "automatedProcess": "0xa5CD0fF02c3739b357838E9df24bC3086B055038",
  "inventoryManagement": "0x6cF2e7D0Bb517B766c50CB4c11b11a6930911237",
  "provenance": "0x9Bb5128f24ac4165e37010D1773435EBA4842ED7"
},
  realEstateContracts: {
  "realEstate": "0x039D709960a7EcADbaffe614C6650561dA5Ad44A",
  "escrowFactory": "0xCe016F3ef98857f38921b7ec9F03C758A9ecd2A2",
  "mortgageFinance": "0xf1CE405F47eC27868a8f1E98AD7dAc8E11334C6e"
},
  seederAddresses: {
    seeder1: '0x1dAC85cD37dBcb1bc87cB486090D3b860FDF1D4d',
    seeder2: '0x1e94Af843Ee3503adB9985a803af22043C44E5a7',
    seeder3: '0x9bC4A8e9A2481FAB9445e31e705525Fe4587b7c1',
    seeder4: '0x15C8731e0C3e09A02D9845C1EF6B3b259b75f606',
    seeder5: '0x32B068d5e85BE1E171ff1241D2bba70d95d49fB5'
  },
  web3: {
    rpcUrl: 'http://127.0.0.1:8545/',
    chainIdHex: '0x7A69',
    chainName: 'Hardhat Playground'
  },
  api: 'http://localhost:3000',
  escrowManager: '0xd2442222cb6B839624716e25eFb6e928C94acBF1'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
