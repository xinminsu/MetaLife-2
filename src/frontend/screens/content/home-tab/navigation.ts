// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
// import {Platform} from 'react-native';
import {Command} from 'cycle-native-navigation';
/*import {Screens} from '../../enums';
const dialogAboutNavOptions =
  Platform.OS === 'web' ? {} : require('../../dialog-about').navOptions;*/

interface Actions {
  // goToAbout$: Stream<any>;
}

export default function navigation(actions: Actions): Stream<Command> {
  /*  const toAbout$ =
    Platform.OS === 'web'
      ? xs.never()
      : actions.goToAbout$.mapTo({
          type: 'showModal',
          layout: {
            component: {
              name: Screens.DialogAbout,
              options: dialogAboutNavOptions,
            },
          },
        } as Command);*/

  return xs.merge();
}
