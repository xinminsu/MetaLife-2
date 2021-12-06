// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Reducer} from '@cycle/state';
// import {WalletSource} from '../../drivers/wallet';

export interface State {
  nick?: string;
  pwd?: string;
}

export interface Actions {
  // newNick$: Stream<string>;
  // newPwd$: Stream<string>;
}

export default function model(actions: Actions): Stream<Reducer<State>> {
  const initReducer$ = xs.of(function initReducer(prev?: State): State {
    if (prev) return prev;
    return {nick: '', pwd: ''};
  });

  /*  const newNickReducer$ = actions.newNick$.map(
      (nick) =>
          function changeNameReducer(prev: State): State {
              return {...prev, nick};
          }
  );

  const newPwdReducer$ = actions.newPwd$.map(
      (pwd) =>
          function changeNameReducer(prev: State): State {
              return {...prev, pwd};
          }
  );*/

  // return xs.merge(initReducer$, newNickReducer$, newPwdReducer$);
  return xs.merge(initReducer$);
}
