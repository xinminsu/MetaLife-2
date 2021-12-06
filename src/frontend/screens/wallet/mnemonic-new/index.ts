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

export interface Sources {
  screen: ReactSource;
  navigation: NavSource;
  state: StateSource<State>;
}

export interface Sinks {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  state: Stream<Reducer<State>>;
}

export function newMnemonic(sources: Sources): Sinks {
  const actions = intent(sources.screen, sources.navigation);
  const reducer$ = model(actions);
  const vdom$ = view(sources.state.stream);
  const command$ = navigation(actions);

  return {
    screen: vdom$,
    state: reducer$,
    navigation: command$,
  };
}
