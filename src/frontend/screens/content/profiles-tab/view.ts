// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import {styles} from './styles';
import {State} from './model';

export default function view(state$: Stream<State>) {
  return state$.map((state) =>
    h(
      SafeAreaView,
      {
        style: [styles.flex1],
      },
      [
        h(
          StatusBar,
          {
            barStyle: 'light-content',
          },
          [
            h(
              ScrollView,
              {
                contentInsetAdjustmentBehavior: 'automatic',
                style: styles.marginTop10,
              },
              [
                h(View, {
                  style: styles.FG,
                }),
              ],
            ),
          ],
        ),
      ],
    ),
  );
}
