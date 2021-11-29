// SPDX-FileCopyrightText: 2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {Text, View} from 'react-native';
import {t} from '../../../drivers/localization';
import Button from '../../../components/Button';
import TopBar from '../../../components/TopBar';
import {State} from '../model';
import {styles} from './styles';

export default function view(state$: Stream<State>) {
  return state$.map((state) =>
    h(View, {style: styles.screen}, [
      h(TopBar, {sel: 'topbar', title: t('wallet.title')}),
      h(Text, {style: styles.content}, state.mnemonic),
      h(Button, {
        sel: 'mnemonic-create',
        style: styles.ctaButton,
        textStyle: styles.buttonText,
        text: t('wallet.mnemonic.create.label'),
        strong: false,
        accessible: true,
        accessibilityLabel: t('wallet.mnemonic.create.accessibility_label'),
      }),
      h(Button, {
        sel: 'mnemonic-process',
        style: styles.button,
        textStyle: styles.buttonText,
        text: t('wallet.mnemonic.process.label'),
        strong: false,
        accessible: true,
        accessibilityLabel: t('wallet.mnemonic.process.accessibility_label'),
      }),
    ]),
  );
}
