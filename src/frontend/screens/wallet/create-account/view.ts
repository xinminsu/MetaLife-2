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
  iconClear: require('../../../../../images/icons/Login_icon_delete.png'),
  iconClose: require('../../../../../images/icons/Login_icon_biyanjing.png'),
  iconOpen: require('../../../../../images/icons/Login_icon_zhengyan.png'),
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

  eye: {
    backgroundColor: '#000000c0',
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
            styles.btnBottom,
          ],
        },
        [
          h(View, {}, [
            h(
              View,
              {style: [stylesBasics.row, stylesBasics.alignItemsCenter]},
              [
                h(TextInput, {
                  sel: 'account-name',
                  style: [
                    stylesBasics.flex1,
                    stylesBasics.input,
                    stylesDefault.text,
                  ],
                  placeholder: 'Account Name',
                  placeholderTextColor: colorsSchema.textHolder,
                  value: state.accountName,
                }),
                h(Pressable, {sel: 'account-name-clear'}, [
                  h(Image, {style: styles.clear, source: iconDic.iconClear}),
                ]),
              ],
            ),
            h(
              View,
              {style: [stylesBasics.row, stylesBasics.alignItemsCenter]},
              [
                h(TextInput, {
                  sel: 'set-password',
                  style: [
                    stylesBasics.flex1,
                    stylesBasics.input,
                    stylesDefault.text,
                  ],
                  placeholder: 'Set password',
                  placeholderTextColor: colorsSchema.textHolder,
                  secureTextEntry: state.passwordSecurity,
                }),
                h(Pressable, {sel: 'pass-word-eye'}, [
                  h(Image, {
                    style: [styles.clear, styles.eye],
                    source: state.passwordSecurity
                      ? iconDic.iconClose
                      : iconDic.iconOpen,
                  }),
                ]),
              ],
            ),
            h(
              View,
              {style: [stylesBasics.row, stylesBasics.alignItemsCenter]},
              [
                h(TextInput, {
                  sel: 'confirm-password',
                  style: [
                    stylesBasics.flex1,
                    stylesBasics.input,
                    stylesDefault.text,
                  ],
                  placeholder: 'Confirm password',
                  placeholderTextColor: colorsSchema.textHolder,
                  secureTextEntry: state.confirmPasswordSecurity,
                }),
                h(Pressable, {sel: 'confirm-password-eye'}, [
                  h(Image, {
                    style: [styles.clear, styles.eye],
                    source: state.confirmPasswordSecurity
                      ? iconDic.iconClose
                      : iconDic.iconOpen,
                  }),
                ]),
              ],
            ),
            h(TextInput, {
              sel: 'password-prompt',
              style: [stylesBasics.input, stylesDefault.text],
              placeholder: 'Password prompt (optional)',
              placeholderTextColor: colorsSchema.textHolder,
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
            seltag: 'round-button',
            title: 'Create Account',
            disabled: false,
          }),
        ],
      ),
    ]),
  );
}
