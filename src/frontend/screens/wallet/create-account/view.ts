// SPDX-FileCopyrightText: 2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {
  View,
  StatusBar,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';

import {State} from './model';

const iconDic = {
  iconClear: require('../../../../../images/icons/text_cancel.png'),
};

import {
  stylesDefault,
  stylesBasics,
  colorsSchema,
} from '../../../global-styles/SchemaStyles';
import RoundBtn from '../../../components/RoundBtn';

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
  },

  text: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '100',
  },

  clear: {
    marginRight: 10,
  },
});

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
          ],
        },
        [
          h(View, {}, [
            h(View, {style: stylesBasics.row}, [
              h(TextInput, {
                sel: 'account-name',
                style: [stylesBasics.input, stylesDefault.text],
                placeholder: 'Account Name',
                placeholderTextColor: colorsSchema.textHolder,
                // onChangeText: setNick
              }),
              h(Pressable, {}, [
                h(Image, {style: styles.clear, source: iconDic.iconClear}),
              ]),
            ]),
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
            style: {
              marginBottom: 50,
            },
            title: 'Create Account',
            disabled: false,
          }),
        ],
      ),
    ]),
  );
}
