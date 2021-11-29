// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {View, Text} from 'react-native';

import {State} from './model';

export default function view(state$: Stream<State>) {
  return state$.map((state) =>
    h(View, {}, [
      h(Text, {}, 'hello home'),

      h(
        Text,
        {
          sel: 'home-dialog',
        },
        'dialog',
      ),
    ]),
  );
}
