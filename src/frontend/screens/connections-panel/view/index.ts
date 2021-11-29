// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import dropRepeatsByKeys from 'xstream-drop-repeats-by-keys';
import {h} from '@cycle/react';
import {Platform, ScrollView, View} from 'react-native';
import {FloatingAction, IActionProps} from 'react-native-floating-action';
import {styles} from './styles';
import {State} from '../model';
import ConnectivityModes from './ConnectivityModes';
import Body from './Body';
import TopBar from '../../../components/TopBar';
import {t} from '../../../drivers/localization';
import {Palette} from '../../../global-styles/palette';
import {getImg} from '../../../global-styles/utils';
import {Dimensions} from '../../../global-styles/dimens';

const ACTION_MARGIN_DESKTOP = 45; // px

function getFABProps(state: State) {
  const visible = state.bluetoothEnabled || state.internetEnabled;

  const actions: Array<IActionProps> = [];
  if (state.internetEnabled) {
    actions.push({
      color: Palette.backgroundCTA,
      name: 'invite-paste',
      margin: Platform.OS === 'web' ? ACTION_MARGIN_DESKTOP : undefined,
      icon: getImg(require('../../../../../images/package-down.png')),
      text: t('connections.floating_action_button.paste_invite'),
    });
  }

  if (state.bluetoothEnabled) {
    actions.push({
      color: Palette.backgroundCTA,
      name: 'bluetooth-search',
      margin: Platform.OS === 'web' ? ACTION_MARGIN_DESKTOP : undefined,
      icon: getImg(require('../../../../../images/bluetooth.png')),
      text: t('connections.floating_action_button.bluetooth_seek'),
    });
  }

  return {
    sel: 'fab',
    color: Palette.backgroundCTA,
    visible,
    actions,
    iconHeight: 24,
    iconWidth: 24,
    overlayColor: Palette.transparencyDark,
    distanceToEdge: {
      vertical: Dimensions.verticalSpaceLarge,
      horizontal: Dimensions.horizontalSpaceBig,
    } as any,
    floatingIcon: getImg(require('../../../../../images/plus-network.png')),
  };
}

export default function view(state$: Stream<State>) {
  return state$
    .compose(
      dropRepeatsByKeys([
        'bluetoothEnabled',
        'bluetoothLastScanned',
        'lanEnabled',
        'internetEnabled',
        'timestampPeersAndRooms',
        'timestampStagedPeers',
        'timestampPeerStates',
      ]),
    )
    .map((state) => {
      return h(View, {style: styles.container}, [
        h(TopBar, {sel: 'topbar', title: t('connections.title')}),
        h(
          ScrollView,
          {
            style: styles.container,
            contentContainerStyle: styles.containerInner,
          },
          [h(ConnectivityModes, state), h(Body, state)],
        ),
        Platform.OS === 'web'
          ? h(View, {style: styles.desktopFabContainer}, [
              h(FloatingAction, getFABProps(state)),
            ])
          : h(FloatingAction, getFABProps(state)),
      ]);
    });
}
