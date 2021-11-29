// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {ReactSource} from '@cycle/react';
import {h} from '@cycle/react';
import {StateSource} from '@cycle/state';
import {ReactElement} from 'react';
import {StyleSheet, Platform, Animated, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Palette} from '../../../global-styles/palette';
import {Dimensions} from '../../../global-styles/dimens';
import {Typography} from '../../../global-styles/typography';
import HeaderMenuButton from '../../../components/HeaderMenuButton';
import HeaderMenuProgress from '../../../components/HeaderMenuProgress';
import HeaderButton from '../../../components/HeaderButton';
import {t} from '../../../drivers/localization';

export type State = {
  currentTab: 'home' | 'messages' | 'contacts' | 'discover' | 'profiles';
  scrollHeaderBy: Animated.Value;
  migrationProgress: number;
  indexingProgress: number;
};

export type Sources = {
  screen: ReactSource;
  state: StateSource<State>;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  menuPress: Stream<any>;
  homeSearch: Stream<any>;
};

export const styles = StyleSheet.create({
  container: {
    zIndex: 30,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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

  homeRightSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  homeRightSideShown: {
    display: 'flex',
  },

  homeRightSideHidden: {
    display: 'none',
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
      web: {
        marginLeft: 0,
      },
      default: {
        marginLeft: Dimensions.horizontalSpaceLarge,
      },
    }),
  },
});

function intent(reactSource: ReactSource) {
  return {
    menu$: xs.merge(
      reactSource.select('menuButton').events('press'),
      reactSource.select('menuProgress').events('press'),
    ),

    homeSearch$: reactSource.select('search').events('press'),
  };
}

function tabTitle(tab: State['currentTab']) {
  if (tab === 'home') {
    return t('content.tab_headers.home');
  }
  if (tab === 'messages') {
    return t('content.tab_headers.messages');
  }
  if (tab === 'contacts') {
    return t('content.tab_headers.contacts');
  }
  if (tab === 'discover') {
    return t('content.tab_headers.discover');
  }
  if (tab === 'profiles') {
    return t('content.tab_headers.profiles');
  }
  return '';
}

function calcTranslateY(scrollY: Animated.Value) {
  if (Platform.OS === 'web') return new Animated.Value(0);
  if (Platform.OS === 'ios') return new Animated.Value(0);
  const minScroll = -getStatusBarHeight(true);
  const clampedScrollY = scrollY.interpolate({
    inputRange: [minScroll, minScroll + 1],
    outputRange: [0, 1],
    extrapolateLeft: 'clamp',
  });
  const translateY = Animated.diffClamp(
    clampedScrollY,
    0,
    Dimensions.toolbarHeight - getStatusBarHeight(true),
  );
  return Animated.multiply(translateY, -1);
}

/**
 * TODO: Disabled for all platforms. This originally was meant for iOS only,
 * but we have issue #811. We should fix #811 and *then* re-enable this.
 */
function calcOpacity(scrollY: Animated.AnimatedMultiplication) {
  if (Platform.OS === 'ios') return new Animated.Value(1);
  if (Platform.OS === 'web') return new Animated.Value(1);
  if (Platform.OS === 'android') return new Animated.Value(1);

  return scrollY.interpolate({
    inputRange: [-getStatusBarHeight(true), 0],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
}

function calcProgress(state: State) {
  const [p1, p2] = [state.migrationProgress, state.indexingProgress];
  if (p1 > 0 && p2 > 0) return (p1 + p2) * 0.5;
  else if (p1 > 0) return p1;
  else if (p2 > 0) return p2;
  else return 1;
}

function view(state$: Stream<State>) {
  let hideYWhenScrolling: Animated.AnimatedMultiplication | null = null;
  let hideOpacityWhenScrolling: Animated.AnimatedMultiplication | null = null;

  return state$.map((state) => {
    // Avoid re-instantiating a new animated value on every stream emission
    if (!hideYWhenScrolling) {
      hideYWhenScrolling = calcTranslateY(state.scrollHeaderBy);
    }
    if (!hideOpacityWhenScrolling) {
      hideOpacityWhenScrolling = calcOpacity(hideYWhenScrolling);
    }

    const translateY = state.currentTab === 'home' ? hideYWhenScrolling : 0;
    const opacity = state.currentTab === 'home' ? hideOpacityWhenScrolling : 1;
    const progress = calcProgress(state);

    return h(
      Animated.View,
      {style: [styles.container, {transform: [{translateY}]}]},
      [
        h(View, {style: styles.innerContainer}, [
          Platform.OS === 'web'
            ? null
            : h(Animated.View, {style: {opacity}}, [
                progress > 0 && progress < 1
                  ? h(HeaderMenuProgress, {
                      sel: 'menuProgress',
                      progress,
                    })
                  : HeaderMenuButton('menuButton'),
              ]),
          h(
            Animated.Text,
            {style: [styles.title, {opacity}]},
            tabTitle(state.currentTab),
          ),
          h(
            Animated.View,
            {
              style: [
                styles.homeRightSide,
                state.currentTab === 'home'
                  ? styles.homeRightSideShown
                  : styles.homeRightSideHidden,
                {opacity},
              ],
            },
            [
              h(HeaderButton, {
                sel: 'search',
                icon: 'magnify',
                side: 'right',
                accessibilityLabel: t('home.search.accessibility_label'),
              }),
            ],
          ),
        ]),
      ],
    );
  });
}

export function topBar(sources: Sources): Sinks {
  const actions = intent(sources.screen);
  const vdom$ = view(sources.state.stream);

  return {
    screen: vdom$,
    menuPress: actions.menu$,
    homeSearch: actions.homeSearch$,
  };
}
