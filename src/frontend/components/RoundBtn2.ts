// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import {h} from '@cycle/react';

import {stylesBasics} from '../global-styles/SchemaStyles';

export const Touchable = Platform.select<any>({
  android: TouchableNativeFeedback,
  default: TouchableOpacity,
});

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
};

type State = {
  active: boolean;
};

export default class RoundBtn2 extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {active: false};
  }
  public render() {
    const {title, disabled} = this.props;

    return h(
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
    );
  }
}
