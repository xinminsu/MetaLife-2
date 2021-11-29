// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {ReactElement} from 'react';
import {ReactSource} from '@cycle/react';
import {StateSource, Reducer} from '@cycle/state';
import {Command, NavSource} from 'cycle-native-navigation';
import {AboutAndExtras} from '../../ssb/types';
import {WindowSize} from '../../drivers/window-size';
import view from './view';

export type Props = {about: AboutAndExtras};

export type Sources = {
  props: Stream<Props>;
  screen: ReactSource;
  navigation: NavSource;
  state: StateSource<State>;
  windowSize: Stream<WindowSize>;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  state: Stream<Reducer<State>>;
};

export type State = Props;

export const navOptions = {
  topBar: {
    visible: false,
    height: 0,
  },
};

export function biography(sources: Sources): Sinks {
  const vdom$ = view(sources.state.stream, sources.windowSize);
  const command$ = xs
    .merge(
      sources.navigation.backPress(),
      sources.screen.select('topbar').events('pressBack'),
    )
    .mapTo({type: 'pop'} as Command);

  const reducer$ = sources.props.map(
    (props) =>
      function propsReducer(): State {
        return props;
      },
  );

  return {
    screen: vdom$,
    navigation: command$,
    state: reducer$,
  };
}
