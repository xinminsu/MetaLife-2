/* Default HD path string for key generation from seed */
export const hdPathString = `m/44'/60'/0'/0`;
/* keystore will be saved to local storage under this key */
export const localStorageKey = 'key';

export const ganachehost = 'http://localhost:7545';

export const rinkeby =
  'https://rinkeby.infura.io/v3/d5bf08bc271a46c0a9dc3e7fea5bf5df';

/*usage: convert amount to wei
const sendAmount = new BigNumber(amount).times(Ether);
*/
export const Ether = (1.0e18).toString();
export const Gwei = (1.0e9).toString();
