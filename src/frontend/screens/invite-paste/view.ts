// SPDX-FileCopyrightText: 2018-2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {View, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import {t} from '../../drivers/localization';
import {Palette} from '../../global-styles/palette';
import TopBar from '../../components/TopBar';
import Button from '../../components/Button';
import {State} from './model';
import {styles} from './styles';

export default function view(state$: Stream<State>) {
  return state$.map((state) => {
    const acceptEnabled = state.content.length > 0;

    return h(View, {style: styles.container}, [
      h(TopBar, {sel: 'topbar'}, [
        h(Button, {
          sel: 'inviteAcceptButton',
          style: acceptEnabled
            ? styles.acceptButtonEnabled
            : styles.acceptButtonDisabled,
          text: t('call_to_action.done'),
          strong: acceptEnabled,
          accessible: true,
          accessibilityLabel: t(
            'invite_paste.call_to_action.accept.accessibility_label',
          ),
        }),
      ]),

      h(
        KeyboardAvoidingView,
        {
          style: styles.bodyContainer,
          enabled: true,
          ...Platform.select({ios: {behavior: 'padding' as const}}),
        },
        [
          h(TextInput, {
            style: styles.contentInput,
            sel: 'contentInput',
            nativeID: 'FocusViewOnResume',
            accessible: true,
            accessibilityLabel: t(
              'invite_paste.text_field.accessibility_label',
            ),
            autoFocus: true,
            multiline: true,
            returnKeyType: 'done',
            placeholder: t('invite_paste.placeholder'),
            placeholderTextColor: Palette.textWeak,
            selectionColor: Palette.backgroundTextSelection,
            underlineColorAndroid: Palette.backgroundTextWeak,
          }),
        ],
      ),
    ]);
  });
}
