// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

// @ts-ignore
import {randomBytes} from 'react-native-randombytes';

export default class WalletSource {
  constructor() {}

  getRandom = (count: any) =>
    new Promise((resolve, reject) => {
      return randomBytes(count, (err: any, bytes: unknown) => {
        if (err) reject(err);
        else resolve(bytes);
      });
    });

  getAccFunc = async (
    web3: {eth: {getAccounts: () => any}},
    STPupdateAccounts: (arg0: any) => void,
  ) => {
    try {
      let myAccounts;
      const accountsRet = await web3.eth.getAccounts();
      if (accountsRet.length === 0) {
        console.log('empty account');
        myAccounts = '0x0';
      } else {
        myAccounts = accountsRet[0];
      }
      console.log(myAccounts);
      STPupdateAccounts(myAccounts);
    } catch (err) {
      console.warn(err);
    }
  };

  createAccFunc = async (
    web3: {eth: {accounts: {create: (arg0: unknown) => any}}},
    STPupdateAccounts: (arg0: any) => void,
  ) => {
    try {
      let myAccounts;
      const entropy = await this.getRandom(16);
      console.log(entropy);
      if (web3.eth.accounts) {
        myAccounts = web3.eth.accounts.create(entropy);
        console.log(myAccounts);
        STPupdateAccounts(myAccounts.address);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  checkAccount(
    web3: {eth: {getAccounts: () => any}},
    STPupdateAccounts: (arg0: any) => void,
  ) {
    try {
      this.getAccFunc(web3, STPupdateAccounts);
    } catch (err) {
      // console.warn('web3 provider not open');
      console.warn(err);
      return err;
    }
  }

  async checkNetwork(web3: {eth: {getBlock: (arg0: number) => Promise<any>}}) {
    try {
      return web3.eth.getBlock(0).then((block) => {
        console.log(block.hash);
        switch (block.hash) {
          case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
            return 'main';
          case '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177':
            return 'rinkeby';
          case '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d':
            return 'ropsten';
          case '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9':
            return 'kovan';
          default:
            return 'local';
        }
      });
    } catch (err) {
      console.warn('web3 provider not open');
      return 'none';
    }
  }
}
