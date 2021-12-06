// SPDX-FileCopyrightText: 2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {ReactSource} from '@cycle/react';
import {NavSource} from 'cycle-native-navigation';

export default function intent(
  screenSource: ReactSource,
  navSource: NavSource,
) {
  return {
    newMnemonic$: screenSource.select('mnemonic-create').events('press'),

    checkMnemonic$: screenSource.select('mnemonic-process').events('press'),
  };
}
