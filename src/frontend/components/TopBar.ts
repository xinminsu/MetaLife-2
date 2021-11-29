// SPDX-FileCopyrightText: 2020-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PureComponent, createElement as $} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {t} from '../drivers/localization';
import {Palette} from '../global-styles/palette';
import {Dimensions} from '../global-styles/dimens';
import {Typography} from '../global-styles/typography';
import HeaderButton from './HeaderButton';

const styles = StyleSheet.create({
  container: {
    height: Dimensions.toolbarHeight,
    paddingTop: getStatusBarHeight(true),
    alignSelf: 'stretch',
    backgroundColor: Palette.brandMain,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Dimensions.horizontalSpaceBig,
    ...Platform.select({
      web: {
        maxWidth: Dimensions.desktopMiddleWidth.vw,
      },
    }),
  },

  title: {
    color: Palette.textForBackgroundBrand,
    fontSize: Typography.fontSizeLarge,
    fontFamily: Typography.fontFamilyReadableText,
    fontWeight: 'bold',
    ...Platform.select({
      ios: {
        position: 'absolute',
        top: Dimensions.verticalSpaceTiny,
        bottom: 0,
        left: 40,
        right: 40,
        textAlign: 'center',
        marginLeft: 0,
      },
      default: {
        marginLeft: Dimensions.horizontalSpaceLarge,
      },
    }),
  },

  rightSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export interface Props {
  title?: string;
  onPressBack?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default class TopBar extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const {title, onPressBack, style} = this.props;
    return $(View, {key: 'outer', style: [styles.container, style]}, [
      $(View, {key: 'inner', style: styles.innerContainer}, [
        $(HeaderButton, {
          key: 'back',
          onPress: onPressBack,
          icon: Platform.select({ios: 'chevron-left', default: 'arrow-left'}),
          ...Platform.select({ios: {iconSize: Dimensions.iconSizeLarge}}),
          accessibilityLabel: t('call_to_action.go_back.accessibility_label'),
        }),
        title ? $(Text, {key: 'title', style: styles.title}, title) : null,
        this.props.children
          ? $(
              View,
              {key: 'right', style: styles.rightSide},
              this.props.children,
            )
          : null,
      ]),
    ]);
  }
}
