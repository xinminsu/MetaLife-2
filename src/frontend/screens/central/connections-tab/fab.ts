// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {State} from './model';
import {IFloatingActionProps as Props} from 'react-native-floating-action';
import {Palette} from '../../../global-styles/palette';
import {Dimensions} from '../../../global-styles/dimens';
import {getImg} from '../../../global-styles/utils';

export default function floatingAction(state$: Stream<State>): Stream<Props> {
  return xs.of({
    sel: 'fab',
    color: Palette.backgroundCTA,
    visible: false,
    actions: [],
    iconHeight: 24,
    iconWidth: 24,
    overlayColor: Palette.transparencyDark,
    distanceToEdge: {
      vertical: Dimensions.verticalSpaceLarge,
      horizontal: Dimensions.horizontalSpaceBig,
    } as any,
    floatingIcon: getImg(require('../../../../../images/plus-network.png')),
  });
}
