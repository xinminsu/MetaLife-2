// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PureComponent} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {h} from '@cycle/react';
import {stylesDefault} from '../global-styles/SchemaStyles';
import * as React from 'react';

export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  titleContainer: {
    marginLeft: 15,
    marginVertical: 18,
  },
  ti: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export type Props = {
  title: string;
  children?:
    | React.ComponentClass<any>
    | React.ReactElement<any>
    | (() => React.ReactElement<any>)
    | null;
};

export default class Section extends PureComponent<Props> {
  public render() {
    const {title, children} = this.props;

    return h(View, {style: stylesDefault.FG}, [
      h(View, {style: styles.titleContainer}, [
        h(Text, {style: [stylesDefault.text, styles.ti]}, title),
      ]),
      children ?? null,
    ]);
  }
}
