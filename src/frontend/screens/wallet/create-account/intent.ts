// SPDX-FileCopyrightText: 2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {ReactSource} from '@cycle/react';
import {NavSource} from 'cycle-native-navigation';
import {Stream} from 'xstream';

export default function intent(
  screenSource: ReactSource,
  navSource: NavSource,
) {
  return {
    updateAccountName$: screenSource
      .select('account-name')
      .events('changeText') as Stream<string>,

    updatePassword$: screenSource
      .select('set-password')
      .events('changeText') as Stream<string>,

    updateConfirmPassword$: screenSource
      .select('confirm-password')
      .events('changeText') as Stream<string>,

    updatePwdPrompt$: screenSource
      .select('password-prompt')
      .events('changeText') as Stream<string>,

    clearAccountName$: screenSource
      .select('account-name-clear')
      .events('press'),
  };
}
