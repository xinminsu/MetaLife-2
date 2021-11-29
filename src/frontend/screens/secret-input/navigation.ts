// SPDX-FileCopyrightText: 2018-2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import sample from 'xstream-sample';
import {Command} from 'cycle-native-navigation';
import {Screens} from '../enums';
import {navOptions as centralNavOpts} from '../central';
import {State} from './model';

type Actions = {
  goBack$: Stream<any>;
};

export default function navigation(
  state$: Stream<State>,
  actions: Actions,
  confirmation$: Stream<boolean>,
) {
  return xs.merge(
    actions.goBack$.mapTo({type: 'pop'} as Command),

    confirmation$
      .filter((x) => x === true)
      .compose(sample(state$))
      .map((state) =>
        state.practiceMode
          ? ({type: 'popToRoot'} as Command)
          : ({
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
            } as Command),
      ),
  );
}
