// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Command} from 'cycle-native-navigation';
import {Screens} from '../../enums';
import {navOptions as centralNavOpts} from '../../content';

export type Actions = {
  confirm$: Stream<any>;
};

export default function navigation(actions: Actions): Stream<Command> {
  const goToContent$ = xs.merge(actions.confirm$).mapTo({
    type: 'setStackRoot',
    layout: {
      sideMenu: {
        center: {
          stack: {
            id: 'mainstack',
            children: [
              {
                component: {
                  name: Screens.Content,
                  options: centralNavOpts,
                },
              },
            ],
          },
        },
      },
    },
  } as Command);

  return xs.merge(goToContent$);
}
