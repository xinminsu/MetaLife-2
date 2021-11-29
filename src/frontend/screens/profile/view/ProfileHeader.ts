// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {h} from '@cycle/react';
import {Fragment, Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const stripMarkdownOneline = require('strip-markdown-oneline');
import {t} from '../../../drivers/localization';
import Button from '../../../components/Button';
import ToggleButton from '../../../components/ToggleButton';
import {Dimensions} from '../../../global-styles/dimens';
import {Palette} from '../../../global-styles/palette';
import {Alias} from '../../../ssb/types';
import {canonicalizeAliasURL} from '../../../ssb/utils/alias';
import {State} from '../model';
import {styles} from './styles';

function Biography({about}: {about: State['about']}) {
  if (!about.description) return null;

  return h(
    TouchableOpacity,
    {
      sel: 'bio',
      accessible: true,
      accessibilityLabel: t('profile.details.biography.accessibility_label'),
    },
    [
      h(View, {style: styles.biographyContainer, pointerEvents: 'box-only'}, [
        h(
          Text,
          {
            key: 'c',
            numberOfLines: 2,
            ellipsizeMode: 'tail',
            style: styles.biographyContent,
          },
          [stripMarkdownOneline(about.description)],
        ),
      ]),
    ],
  );
}

function Counter({
  selector,
  title,
  content,
}: {
  selector: string;
  title: string;
  content: string;
}) {
  return h(TouchableOpacity, {sel: selector}, [
    h(
      Text,
      {
        key: 'c',
        numberOfLines: 1,
        ellipsizeMode: 'tail',
        style: styles.counterContent,
      },
      [
        content,
        title
          ? h(Text, {key: 't', style: styles.counterContentTitle}, ' ' + title)
          : '',
      ],
    ),
  ]);
}

function FollowSection({
  following,
  followers,
}: {
  following: State['following'];
  followers: State['followers'];
}) {
  if (!following && !followers) return null;

  return h(View, {style: styles.detailsRow}, [
    h(Icon, {
      size: Dimensions.iconSizeSmall,
      color: Palette.textPositive,
      name: 'account-plus',
    }),

    following
      ? h(Counter, {
          selector: 'following',
          content: `${following.length}`,
          title: t('profile.details.counters.following'),
        })
      : null,
    followers
      ? h(Counter, {
          selector: 'followers',
          content: `${followers.length}`,
          title: t('profile.details.counters.followers'),
        })
      : null,
  ]);
}

function FollowsYou() {
  return h(View, {style: styles.detailsRow}, [
    h(Icon, {
      size: Dimensions.iconSizeSmall,
      color: Palette.textPositive,
      name: 'check-bold',
    }),
    h(Text, {style: styles.followsYouText}, t('profile.info.follows_you')),
  ]);
}

function AliasesSection({
  aliases,
  onPressAlias,
  isSelfProfile,
}: {
  aliases: State['aliases'];
  onPressAlias?: (a: Alias) => void;
  isSelfProfile: boolean;
}) {
  if (aliases.length === 0) return null;

  return h(Fragment, [
    ...aliases.map((a) =>
      h(View, {key: a.aliasURL, style: styles.detailsRow}, [
        h(Icon, {
          size: Dimensions.iconSizeSmall,
          color: Palette.textBrand,
          name: 'link-variant',
        }),
        h(
          Text,
          {
            selectable: isSelfProfile,
            style: styles.aliasLink,
            onPress: () => {
              if (!isSelfProfile) onPressAlias?.(a);
            },
          },
          canonicalizeAliasURL(a.aliasURL),
        ),
      ]),
    ),
  ]);
}

export default class ProfileHeader extends Component<{state: State}> {
  public shouldComponentUpdate(nextProps: ProfileHeader['props']) {
    const prev = this.props.state;
    const next = nextProps.state;
    if (next.about.name !== prev.about.name) return true;
    if (next.about.imageUrl !== prev.about.imageUrl) return true;
    if (next.about.description !== prev.about.description) return true;
    if (next.aliases.length !== prev.aliases.length) return true;
    if (next.following?.length !== prev.following?.length) return true;
    if (next.followers?.length !== prev.followers?.length) return true;
    if (next.youBlock?.response !== prev.youBlock?.response) return true;
    if (next.youFollow?.response !== prev.youFollow?.response) return true;
    if (next.followsYou?.response !== prev.followsYou?.response) return true;
    return false;
  }

  public render() {
    const state = this.props.state;
    const {about, following, followers, aliases} = state;
    const isSelfProfile = state.displayFeedId === state.selfFeedId;
    const followsYou = state.followsYou?.response ?? false;
    const youFollow = state.youFollow?.response ?? false;
    const youBlock = state.youBlock?.response ?? false;

    return h(View, {style: styles.header}, [
      h(View, {style: styles.cover}),

      h(View, {style: styles.sub}, [
        h(View, {style: styles.cta}, [
          isSelfProfile
            ? h(Button, {
                sel: 'editProfile',
                text: t('profile.call_to_action.edit_profile.label'),
                accessible: true,
                accessibilityLabel: t(
                  'profile.call_to_action.edit_profile.accessibility_label',
                ),
              })
            : youBlock
            ? null
            : h(ToggleButton, {
                sel: 'follow',
                style: styles.follow,
                text: youFollow
                  ? t('profile.info.following')
                  : t('profile.call_to_action.follow'),
                toggled: youFollow,
              }),
        ]),
      ]),

      h(View, {style: styles.detailsArea}, [
        h(Biography, {about}),
        h(FollowSection, {following, followers}),
        followsYou ? h(FollowsYou) : null,
        h(AliasesSection, {sel: 'aliases', aliases, isSelfProfile}),
      ]),

      h(View, {style: styles.headerMarginBottom}),
    ]);
  }
}
