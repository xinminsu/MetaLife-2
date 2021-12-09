// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {h} from '@cycle/react';
import * as React from 'react';
import {Palette} from '../global-styles/palette';
import {Dimensions} from '../global-styles/dimens';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.colors.white,
    padding: Dimensions.defaultPadding,
    borderWidth: 1,
    borderColor: Palette.colors.darkGray,
    borderRadius: 4,
  },
  label: {
    color: Palette.colors.darkGray,
    fontSize: 16,
    fontWeight: '600',
  },
});

export type Props = {
  children?:
    | React.ComponentClass<any>
    | React.ReactElement<any>
    | (() => React.ReactElement<any>)
    | null;
};

export default class TextBullet extends PureComponent<Props> {
  public render() {
    const {children} = this.props;

    return h(View, {style: styles.container}, [
      h(Text, {style: styles.label}, [children]),
    ]);
  }
}
