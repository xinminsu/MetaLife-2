// SPDX-FileCopyrightText: 2020-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {StyleSheet, Platform} from 'react-native';
import {Palette} from '../../global-styles/palette';
import {Dimensions} from '../../global-styles/dimens';
import {Typography} from '../../global-styles/typography';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Palette.voidMain,
    flexDirection: 'column',
  },

  mentionsOverlay: {
    flex: 1,
    alignSelf: 'stretch',
  },

  mentionsInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Palette.backgroundText,
    paddingLeft:
      Dimensions.horizontalSpaceBig +
      (Dimensions.avatarSizeNormal - Dimensions.iconSizeNormal) * 0.5,
    paddingRight: Dimensions.horizontalSpaceBig,
    elevation: 3,
    ...Platform.select({
      ios: {
        zIndex: 10,
        paddingBottom: Dimensions.verticalSpaceSmall,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      web: {
        maxWidth: Dimensions.desktopMiddleWidth.vw,
      },
    }),
  },

  mentionsInput: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: Dimensions.verticalSpaceSmall,
    paddingLeft: 3,
    marginLeft:
      (Dimensions.avatarSizeNormal - Dimensions.iconSizeNormal) * 0.5 +
      Dimensions.horizontalSpaceTiny,
    marginTop: Dimensions.verticalSpaceNormal,
    fontSize: Typography.fontSizeBig,
    textAlign: 'left',
    textAlignVertical: 'top',
    color: Palette.text,
  },

  mentionsIcon: {
    marginBottom: Platform.select({
      ios: Dimensions.verticalSpaceTiny,
      default: Dimensions.verticalSpaceSmall,
    }),
  },

  mentionsList: {
    flex: 1,
    alignSelf: 'stretch',
  },

  empty: {
    marginTop: Dimensions.verticalSpaceBig,
  },

  shown: {
    display: 'flex',
  },

  hidden: {
    display: 'none',
  },

  nextButtonEnabled: {
    minWidth: 68,
    backgroundColor: Palette.backgroundCTA,
    marginLeft: Dimensions.horizontalSpaceNormal,
  },

  nextButtonDisabled: {
    backgroundColor: Palette.brandWeak,
    minWidth: 68,
    marginLeft: Dimensions.horizontalSpaceNormal,
  },
});
