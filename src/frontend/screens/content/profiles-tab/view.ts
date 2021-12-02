// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  ImageBackground,
  Image,
  Text,
  Pressable,
} from 'react-native';
import {styles} from './styles';
import {State} from './model';

const iconDic = {
  BG: require('../../../../../images/profiles/Profiles_backgroud.png'),
  icon_setting: require('../../../../../images/profiles/Profiles_icon_setting.png'),
  photo: require('../../../../../images/profiles/photo.png'),
};

export default function view(state$: Stream<State>) {
  return state$.map((state) =>
    h(View, {style: styles.container}, [
      h(
        ImageBackground,
        {
          style: [styles.headercontainer, styles.alignItemsCenter],
          source: iconDic.BG,
        },
        [
          h(Image, {style: styles.photo, source: iconDic.photo}),
          h(Text, {style: [styles.name, styles.marginTop10]}, 'Blanche Hall'),
          h(Pressable, {style: styles.setting}, [
            h(Image, {source: iconDic.icon_setting}),
          ]),
        ],
      ),
      h(
        SafeAreaView,
        {
          style: [styles.flex1],
        },
        [
          h(
            StatusBar,
            {
              barStyle: 'light-content',
            },
            [
              h(
                ScrollView,
                {
                  contentInsetAdjustmentBehavior: 'automatic',
                  style: styles.marginTop10,
                },
                [
                  h(View, {
                    style: styles.FG,
                  }),
                ],
              ),
            ],
          ),
        ],
      ),
    ]),
  );
}
