// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {StyleSheet} from 'react-native';
import {Dimensions} from '../../../global-styles/dimens';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    top: Dimensions.toolbarHeight,
    marginBottom: Dimensions.toolbarHeight,
  },
  item: {
    height: 112,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    color: 'white',
    fontSize: 22,
    marginLeft: 64,
  },
  justifyCenter: {
    justifyContent: 'center',
  },

  marginTop10: {
    marginTop: 10,
  },
});
