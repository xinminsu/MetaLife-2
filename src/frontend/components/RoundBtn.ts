// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {h} from '@cycle/react';

import {stylesBasics} from '../global-styles/SchemaStyles';

export const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 22,
    height: 44,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export type Props = {
  title: string;
  disabled: boolean;
  style?: StyleProp<ViewStyle>;
};

type State = {
  active: boolean;
};

export default class RoundBtn extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {active: false};
  }
  public render() {
    const {title, disabled, style} = this.props;

    return h(TouchableNativeFeedback, {style}, [
      h(
        View,
        {
          style: [
            styles.border,
            disabled
              ? stylesBasics.btnDisabledBG
              : this.state.active
              ? stylesBasics.btnActiveBG
              : stylesBasics.btnInactiveBG,
          ],
          onTouchStart: () => this.setState(() => ({active: true})),
          onTouchEnd: () => this.setState(() => ({active: false})),
        },
        [
          h(
            Text,
            {
              style: [
                styles.title,
                disabled
                  ? stylesBasics.btnDisabledFG
                  : this.state.active
                  ? stylesBasics.btnActiveFG
                  : stylesBasics.btnInactiveFG,
              ],
            },
            title,
          ),
        ],
      ),
    ]);
  }
}
