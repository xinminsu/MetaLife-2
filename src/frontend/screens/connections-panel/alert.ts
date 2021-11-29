// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Command as AlertCommand} from '../../drivers/dialogs';
import {t} from '../../drivers/localization';
import {Palette} from '../../global-styles/palette';
import {State} from './model';

export interface Actions {
  showBluetoothHelp$: Stream<any>;
  showLANHelp$: Stream<any>;
  showPubHelp$: Stream<any>;
}

export default function alert(
  actions: Actions,
  state$: Stream<State>,
): Stream<AlertCommand> {
  return state$
    .map((state) =>
      xs.merge(
        actions.showBluetoothHelp$.mapTo({
          type: 'alert' as const,
          title: t('connections.modes.bluetooth.title'),
          content:
            (state.bluetoothEnabled
              ? t('connections.modes.generic.enabled')
              : t('connections.modes.bluetooth.disabled')) +
            '\n\n' +
            t('connections.modes.bluetooth.description'),
          options: {
            ...Palette.dialogColors,
            positiveColor: Palette.textDialogStrong,
            positiveText: t('call_to_action.ok'),
          },
        }),
        actions.showLANHelp$.mapTo({
          type: 'alert' as const,
          title: t('connections.modes.wifi.title'),
          content:
            (state.lanEnabled
              ? t('connections.modes.generic.enabled')
              : t('connections.modes.wifi.disabled')) +
            '\n\n' +
            t('connections.modes.wifi.description'),
          options: {
            ...Palette.dialogColors,
            positiveColor: Palette.textDialogStrong,
            positiveText: t('call_to_action.ok'),
          },
        }),
        actions.showPubHelp$.mapTo({
          type: 'alert' as const,
          title: t('connections.modes.servers.title'),
          content:
            (state.internetEnabled
              ? t('connections.modes.generic.enabled')
              : t('connections.modes.servers.disabled')) +
            '\n\n' +
            t('connections.modes.servers.description'),
          options: {
            ...Palette.dialogColors,
            positiveColor: Palette.textDialogStrong,
            positiveText: t('call_to_action.ok'),
          },
        }),
      ),
    )
    .flatten();
}
