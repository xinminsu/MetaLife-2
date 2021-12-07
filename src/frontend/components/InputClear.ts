// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PureComponent} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {h} from '@cycle/react';

import {
  stylesDefault,
  stylesBasics,
  colorsSchema,
} from '../global-styles/SchemaStyles';

const styles = StyleSheet.create({
  clear: {
    marginRight: 20,
  },
});

const iconDic = {
  iconClear: require('../../../images/icons/text_cancel.png'),
};

export type Props = {
  style?: StyleProp<ViewStyle>;
};

type State = {
  accountName: string;
};

export default class InputClear extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const {style} = this.props;
    return h(View, {style: style ?? null}, [
      h(View, {style: [stylesBasics.row, stylesBasics.alignItemsCenter]}, [
        h(TextInput, {
          style: [stylesBasics.flex1, stylesBasics.input, stylesDefault.text],
          placeholder: 'Account Name',
          placeholderTextColor: colorsSchema.textHolder,
          value: this.state?.accountName,
          onChangeText: (text) => this.setState(() => ({accountName: text})),
        }),
        h(
          Pressable,
          {
            onPress: () => this.setState(() => ({accountName: ''})),
          },
          [h(Image, {style: styles.clear, source: iconDic.iconClear})],
        ),
      ]),
    ]);
  }
}
