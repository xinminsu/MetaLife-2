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
    // createAccount$: screenSource.select('account-name').events('press'),
    // setPassword$: screenSource.select('set-password').events('press'),
  };
}
