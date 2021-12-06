// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Reducer} from '@cycle/state';
//  import {WalletSource} from '../../drivers/wallet';

export interface State {
  mnemonic?: string;
}

export interface Actions {
  newMnemonic$: Stream<string>;
}

/*function generateMnemonic(){
  var promise = new Promise(async function (resolve, reject) {
    try {
      let words;
      words = await bip39.generateMnemonic(128) // default to 128
      resolve(words)
    } catch (e) {
      reject('generate mnemonic false')
    }
  });
  return promise;
}*/

export default function model(actions: Actions): Stream<Reducer<State>> {
  const initReducer$ = xs.of(function initReducer(prev?: State): State {
    if (prev) return prev;
    return {mnemonic: ''};
  });

  const updatePostMnemonicReducer$ = actions.newMnemonic$.map(
    (text) =>
      function updatePostTextReducer(prev?: State): State {
        return {
          mnemonic:
            'earth rescue illegal accident swing unit weapon adapt body kitchen family clarify',
        };
        /*const words = await runAsync(bip39.generateMnemonic)(128);
          return {mnemonic: words}*/
        /*let walletSource = new WalletSource();
          walletSource.generateMnemonic().map(text => {
              return {mnemonic: text};}
          );*/
      },
  );

  return xs.merge(initReducer$, updatePostMnemonicReducer$);
}
