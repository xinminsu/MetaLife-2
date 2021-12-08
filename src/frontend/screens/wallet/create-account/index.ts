// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {ReactElement} from 'react';
import {ReactSource} from '@cycle/react';
import {StateSource, Reducer} from '@cycle/state';
import {Command, NavSource} from 'cycle-native-navigation';
import model, {State} from './model';
import view from './view';
import intent from './intent';
import navigation from './navigation';
import dialog from './dialog';
import {DialogSource} from '../../../drivers/dialogs';

export type Sources = {
  screen: ReactSource;
  navigation: NavSource;
  state: StateSource<State>;
  dialog: DialogSource;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  state: Stream<Reducer<State>>;
};

export function createWalletAccount(sources: Sources): Sinks {
  const state$ = sources.state.stream;
  const actions = intent(sources.screen, sources.navigation);
  const confirmation$ = dialog(actions, state$, sources.dialog);
  const reducer$ = model(actions);
  const vdom$ = view(sources.state.stream);
  const command$ = navigation(state$, actions, confirmation$);

  return {
    screen: vdom$,
    state: reducer$,
    navigation: command$,
  };
}
