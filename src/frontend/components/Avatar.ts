// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {h} from '@cycle/react';
import {View, Image, StyleProp, ViewStyle, StyleSheet} from 'react-native';
import {PureComponent} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Palette} from '../global-styles/palette';
import {Dimensions} from '../global-styles/dimens';
import {getImg} from '../global-styles/utils';

const dotStyle: ViewStyle = {
  position: 'absolute',
  borderColor: Palette.backgroundText,
  borderWidth: 1,
};

export const styles = StyleSheet.create({
  connectedDot: {
    ...dotStyle,
    backgroundColor: Palette.backgroundPeerConnected,
  },

  connectingDot: {
    ...dotStyle,
    backgroundColor: Palette.backgroundPeerConnecting,
  },

  disconnectingDot: {
    ...dotStyle,
    backgroundColor: Palette.backgroundPeerDisconnecting,
  },
});

export interface Props {
  size: number;
  url: string | null | undefined;
  backgroundColor?: string;
  overlayIcon?: string;
  dot?: 'connected' | 'connecting' | 'disconnecting';
  style?: StyleProp<ViewStyle>;
}

export default class Avatar extends PureComponent<Props> {
  private renderOverlayIcon(
    size: number,
    borderRadius: number,
    overlayIcon: string,
  ) {
    const overlayStyle = {
      height: size,
      width: size,
      borderRadius,
      position: 'absolute' as 'absolute',
      backgroundColor: Palette.transparencyDark,
    };
    const top = size * 0.5 - Dimensions.iconSizeNormal * 0.5;
    const left = top;
    return h(View, {style: overlayStyle}, [
      h(Icon, {
        size: Dimensions.iconSizeNormal,
        color: Palette.textForBackgroundBrand,
        name: overlayIcon,
        style: {top, left, position: 'absolute'},
      }),
    ]);
  }

  private renderDot(dot: NonNullable<Props['dot']>, size: number) {
    const s = {
      width: 0.25 * size,
      height: 0.25 * size,
      bottom: 0.1 * size,
      right: -0.025 * size,
      borderRadius: 0.125 * size,
    };
    return h(View, {
      style: [
        s,
        dot === 'connected'
          ? styles.connectedDot
          : dot === 'disconnecting'
          ? styles.disconnectingDot
          : styles.connectingDot,
      ],
    });
  }

  public render() {
    const {style, size, backgroundColor, url, overlayIcon, dot} = this.props;
    const borderRadius = size >> 1; // tslint:disable-line:no-bitwise
    const baseStyle = {
      height: size,
      width: size,
      borderRadius,
      backgroundColor:
        backgroundColor ??
        (Palette.isDarkTheme ? Palette.brandStronger : Palette.brandWeakest),
    };
    return h(View, {style: [baseStyle, style]}, [
      h(Image, {
        style: {borderRadius, width: size, height: size},
        source: url
          ? {uri: url}
          : getImg(require('../../../images/empty-avatar.png')),
      }),
      overlayIcon
        ? this.renderOverlayIcon(size, borderRadius, overlayIcon)
        : null,
      dot ? this.renderDot(dot, size) : null,
    ]);
  }
}
