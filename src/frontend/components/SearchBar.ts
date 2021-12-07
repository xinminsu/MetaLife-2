// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PureComponent} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Pressable,
} from 'react-native';
import {h} from '@cycle/react';

import {stylesDefault, stylesBasics} from '../global-styles/SchemaStyles';

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    height: 36,
    marginHorizontal: 16,
  },
  img: {
    marginLeft: 10,
  },
  input: {
    marginLeft: 10,
    fontSize: 15,
  },
  clear: {
    marginRight: 10,
  },
});

const iconDic = {
  iconSearch: require('../../../images/icons/icons_search.png'),
  iconClear: require('../../../images/icons/search_icon_delete.png'),
};

export type Props = {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export default class SearchBar extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  private _onPress = () => {
    const onPress = this.props.onPress;
    if (onPress) {
      onPress();
    }
  };

  public render() {
    const {style} = this.props;
    return h(View, {style: stylesDefault.FG}, [
      h(
        View,
        {
          style: [
            stylesBasics.row,
            stylesBasics.alignItemsCenter,
            stylesDefault.searchBG,
            styles.container,
            style ?? null,
          ],
        },
        [
          h(Image, {style: styles.img, source: iconDic.iconSearch}),
          h(TextInput, {
            style: [stylesBasics.flex1, styles.input, stylesDefault.text],
            placeholder: 'Search',
            placeholderTextColor: stylesDefault.placeholderTextColor.color,
          }),
          h(Pressable, {onPress: this._onPress}, [
            h(Image, {style: styles.clear, source: iconDic.iconClear}),
          ]),
        ],
      ),
    ]);
  }
}
