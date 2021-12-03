// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {FlatList, View, Image, Text} from 'react-native';
import {State} from './model';
import {styles} from './styles';
import {
  stylesDefault,
  stylesBasics,
  colorsSchema,
} from '../../../global-styles/SchemaStyles';

import SearchBar from '../../../components/SearchBar';
import Section from '../../../components/Section';

const iconDic = {
  photo: require('../../../../images/profiles/photo.png'),
  fb: require('../../../../images/profiles/Facebook.png'),
  nf: require('../../../../images/profiles/NewFriends.png'),
  tt: require('../../../../images/profiles/Twitter.png'),
};

const DATA_sn = [{icon: iconDic.fb}, {icon: iconDic.nf}, {icon: iconDic.tt}];
const DATA_contact = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Maud Newman',
    desc: '3 mutual friends',
    icon: iconDic.photo,
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Maud Newman',
    desc: '3 mutual friends',
    icon: iconDic.photo,
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Maud Newman',
    desc: '3 mutual friends',
    icon: iconDic.photo,
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Maud Newman',
    desc: '3 mutual friends',
    icon: iconDic.photo,
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Maud Newman',
    desc: '3 mutual friends',
    icon: iconDic.photo,
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Maud Newman',
    desc: '3 mutual friends',
    icon: iconDic.photo,
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Maud Newman',
    desc: '3 mutual friends',
    icon: iconDic.photo,
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Maud Newman',
    desc: '3 mutual friends',
    icon: iconDic.photo,
  },
];

const contactItem = (x: any, index: any) => {
  return h(
    View,
    {
      key: index,
      style: [stylesBasics.row, styles.contactItemContainer],
    },
    [
      h(Image, {source: x.icon}),
      h(View, {style: styles.textView}, [
        h(Text, {style: [styles.nameTF, stylesDefault.text]}, x.name),
        h(
          Text,
          {style: [styles.descTF, {color: colorsSchema.textHolder}]},
          x.desc,
        ),
      ]),
    ],
  );
};

export default function view(state$: Stream<State>) {
  return state$.map((state) =>
    h(View, {style: [stylesDefault.BG, styles.container]}, [
      h(SearchBar, {style: styles.searchBar}),

      h(Section, {
        title: 'Connect to find more friends',
        children: h(FlatList, {
          data: DATA_sn,
          keyExtractor: (item: any, index: any) => index,
          renderItem: (item: any) => {
            return h(View, {style: styles.item}, [h(Image, {source: item})]);
          },
          horizontal: true,
          ItemSeparatorComponent: null,
          showsHorizontalScrollIndicator: false,
        }),
      }),
      h(Section, {title: 'List'}, DATA_contact.map(contactItem)),
    ]),
  );
}
