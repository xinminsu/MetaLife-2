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

  contactItemContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 22,
  },
  searchBar: {marginVertical: 10},
  textView: {
    marginTop: 12,
    marginLeft: 15,
  },
  nameTF: {
    fontSize: 18,
    marginBottom: 10,
  },
  descTF: {
    fontSize: 15,
  },
});
