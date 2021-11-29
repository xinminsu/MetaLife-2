// SPDX-FileCopyrightText: 2018-2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Command} from 'cycle-native-navigation';
import {navOptions as secretInputNavOpts} from '../secret-input';
import {Screens} from '../enums';
import {navOptions as centralNavOpts} from '../content';

export type Actions = {
  createAccount$: Stream<any>;
  restoreAccount$: Stream<any>;
  skipOrNot$: Stream<boolean>;
};

export default function navigation(actions: Actions): Stream<Command> {
  const skipWelcome$ = actions.skipOrNot$.filter((skip) => skip === true);

  const goToContent$ = xs.merge(actions.createAccount$, skipWelcome$).mapTo({
    type: 'setStackRoot',
    layout: {
      sideMenu: {
        left: {
          component: {name: Screens.Drawer},
        },
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

  const goToSecretInput$ = actions.restoreAccount$.mapTo({
    type: 'push',
    layout: {
      component: {
        name: Screens.SecretInput,
        passProps: {
          practiceMode: false,
        },
        options: secretInputNavOpts,
      },
    },
  } as Command);

  return xs.merge(goToContent$, goToSecretInput$);
}
