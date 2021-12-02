// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {StyleSheet} from 'react-native';
import {Palette} from '../../../global-styles/palette';
import {Dimensions} from '../../../global-styles/dimens';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    top: Dimensions.toolbarHeight,
    marginBottom: Dimensions.toolbarHeight,
  },
  headercontainer: {
    height: 290,
  },

  FG: {
    backgroundColor: Palette.colors.comet9,
  },

  flex1: {
    flex: 1,
  },

  marginTop10: {
    marginTop: 10,
  },

  alignItemsCenter: {
    alignItems: 'center',
  },

  photo: {
    marginTop: 47,
  },

  name: {
    fontSize: 23,
    color: 'white',
    fontWeight: 'bold',
  },

  setting: {
    position: 'absolute',
    right: 15,
    top: 56,
  },
});
