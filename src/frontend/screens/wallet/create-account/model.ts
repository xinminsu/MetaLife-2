// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Reducer} from '@cycle/state';
// import {WalletSource} from '../../drivers/wallet';

export interface State {
  accountName?: string;
  password?: string;
}

export interface Actions {
  clearAccountName$: Stream<any>;
}

export default function model(actions: Actions): Stream<Reducer<State>> {
  const initReducer$ = xs.of(function initReducer(prev?: State): State {
    if (prev) return prev;
    return {accountName: '', password: ''};
  });

  const clearAccountNameReducer$ = actions.clearAccountName$.map(
    (accountName) =>
      function changeNameReducer(prev: State): State {
        return {...prev, accountName: ''};
      },
  );

  return xs.merge(initReducer$, clearAccountNameReducer$);
}
