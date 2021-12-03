// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {FlatList, ImageBackground, Text} from 'react-native';
import {State} from './model';
import {styles} from './styles';

const iconDic = {
  DAO: require('../../../../../images/discover/Discover_backgroud_DAO.png'),
  fc: require('../../../../../images/discover/Discover_backgroud_Featured_Content.png'),
  NFT: require('../../../../../images/discover/Discover_backgroud_NFT.png'),
  pte: require('../../../../../images/discover/Discover_backgroud_Play_to_earn.png'),
  vis: require('../../../../../images/discover/Discover_backgroud_VISwap.png'),
};

const DATA = [
  {title: 'DAO', bgImg: iconDic.DAO},
  {title: 'NFT', bgImg: iconDic.NFT},
  {title: 'Play to earn', bgImg: iconDic.pte},
  {title: 'VISwap', bgImg: iconDic.vis},
  {title: 'Featured Content', bgImg: iconDic.fc},
];

export default function view(state$: Stream<State>) {
  return state$.map((state) =>
    h(FlatList, {
      style: [styles.container, styles.marginTop10],
      data: DATA,
      keyExtractor: (_: any, index: any) => index,
      renderItem: ({item}: any) => {
        return h(
          ImageBackground,
          {
            style: [styles.item, styles.justifyCenter],
            source: item.bgImg,
          },
          [h(Text, {style: styles.title}, item.title)],
        );
      },
    }),
  );
}
