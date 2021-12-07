// SPDX-FileCopyrightText: 2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {View, StatusBar, TextInput, Text, StyleSheet} from 'react-native';

import {State} from './model';

import {
  stylesDefault,
  stylesBasics,
  colorsSchema,
} from '../../../global-styles/SchemaStyles';
import RoundBtn from '../../../components/RoundBtn';
import InputClear from '../../../components/InputClear';

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },

  text: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '100',
  },

  clear: {
    marginRight: 20,
  },

  btnBottom: {
    paddingBottom: 50,
  },
});

export type Props = {
  onPress?: () => void;
};

export default function view(state$: Stream<State>) {
  return state$.map((state) =>
    h(View, {style: [stylesDefault.BG, stylesBasics.flex1]}, [
      h(StatusBar, {barStyle: 'light-content'}),
      h(
        View,
        {
          style: [
            stylesDefault.FG,
            stylesBasics.flex1,
            stylesBasics.marginTop10,
            styles.btnBottom,
          ],
        },
        [
          h(View, {}, [
            h(InputClear, {}),
            h(TextInput, {
              sel: 'set-password',
              style: [stylesBasics.input, stylesDefault.text],
              placeholder: 'Set password',
              placeholderTextColor: colorsSchema.textHolder,
              // onChangeText: setPwd
            }),
            h(TextInput, {
              sel: 'confirm-password',
              style: [stylesBasics.input, stylesDefault.text],
              placeholder: 'Confirm password',
              placeholderTextColor: colorsSchema.textHolder,
              // onChangeText: cfmPwd
            }),
            h(TextInput, {
              sel: 'password-prompt',
              style: [stylesBasics.input, stylesDefault.text],
              placeholder: 'Password prompt (optional)',
              placeholderTextColor: colorsSchema.textHolder,
              // onChangeText: pwdPrompt
            }),
          ]),
          h(View, {style: styles.MainContainer}, [
            h(
              Text,
              {style: styles.text},
              `Note:MetaLife waller does not save user password nor provide backups.All password are required to backup using encrypted private key.We highly recommended to backup and save your private key at the same time,otherwise your wallet can never be retrieved.`,
            ),
          ]),
          h(RoundBtn, {
            sel: 'create-account-button',
            title: 'Create Account',
            disabled: false,
          }),
        ],
      ),
    ]),
  );
}
