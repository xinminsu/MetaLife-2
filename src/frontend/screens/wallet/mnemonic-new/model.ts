// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Reducer} from '@cycle/state';

// const bip39 = require('bip39')

export interface State {
  mnemonic?: string;
}

export interface Actions {
  generateMnemonics$: Stream<string>;
}

export default function model(actions: Actions): Stream<Reducer<State>> {
  const initReducer$ = xs.of(function initReducer(prev?: State): State {
    if (prev) return prev;
    return {mnemonic: ''};
  });

  const generateMnemonicsReducer$ = actions.generateMnemonics$.map(
    (text) =>
      function updateWordsReducer(prev: State): State {
        return {
          ...prev,
          mnemonic: '',
        };
      },
  );

  return xs.merge(initReducer$, generateMnemonicsReducer$);
}
