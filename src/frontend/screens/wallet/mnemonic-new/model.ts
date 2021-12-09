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
  generateMnemonics$: Stream<string>;
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

  const updatePostMnemonicReducer$ = actions.generateMnemonics$.map(
    (text) =>
      function updateWordsReducer(prev: State): State {
        return {
          ...prev,
          mnemonic: text,
        };
      },
  );

  return xs.merge(initReducer$, updatePostMnemonicReducer$);
}
