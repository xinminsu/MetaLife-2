// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import sample from 'xstream-sample';
import {Command} from 'cycle-native-navigation';
import {Screens} from '../../enums';
import {navOptions as centralNavOpts} from '../../content';
import {State} from './model';

export type Actions = {
  confirm$: Stream<any>;
};

export default function navigation(
  state$: Stream<State>,
  actions: Actions,
  confirmation$: Stream<boolean>,
) {
  return xs.merge(
    confirmation$
      .filter((x) => x === true)
      .compose(sample(state$))
      .map(
        (state) =>
          ({
            type: 'setStackRoot',
            layout: {
              sideMenu: {
                center: {
                  stack: {
                    id: 'mainstack',
                    children: [
                      {
                        component: {
                          name: Screens.NewMnemonic,
                          options: centralNavOpts,
                        },
                      },
                    ],
                  },
                },
              },
            },
          } as Command),
      ),
  );
}
