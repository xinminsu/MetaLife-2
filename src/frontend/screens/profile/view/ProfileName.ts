// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {h} from '@cycle/react';
import {Animated} from 'react-native';
import {t} from '../../../drivers/localization';
import {State} from '../model';
import {styles} from './styles';
import {displayName} from '../../../ssb/utils/from-ssb';

export default function ProfileName({
  state,
  translateY,
  inTopBar,
}: {
  state: State;
  translateY: Animated.AnimatedInterpolation;
  inTopBar: boolean;
}) {
  const animStyle = {transform: [{translateY}]};

  return h(
    Animated.Text,
    {
      style: [styles.name, inTopBar ? styles.nameInTopBar : null, animStyle],
      numberOfLines: 1,
      ellipsizeMode: 'middle',
      accessible: true,
      accessibilityRole: 'text',
      accessibilityLabel: t('profile.name.accessibility_label'),
    },
    displayName(state.about.name, state.about.id),
  );
}
