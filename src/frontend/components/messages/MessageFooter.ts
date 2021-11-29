// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Component, PureComponent, Fragment} from 'react';
import {
  View,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import {h} from '@cycle/react';
import EmojiModal from 'react-native-emoji-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Msg, FeedId} from 'ssb-typescript';
import {t} from '../../drivers/localization';
import {Palette} from '../../global-styles/palette';
import {Dimensions} from '../../global-styles/dimens';
import {Typography} from '../../global-styles/typography';
import {
  Reactions as ReactionsType,
  PressReactionsEvent,
  PressAddReactionEvent,
} from '../../ssb/types';

const THUMBS_UP_UNICODE = '\ud83d\udc4d';
const VICTORY_HAND_UNICODE = String.fromCodePoint(parseInt('270C', 16));
const HEART_UNICODE = '\u2764\ufe0f';
const SEE_NO_EVIL_MONKEY_UNICODE = String.fromCodePoint(parseInt('1F648', 16));
const SMILING_WITH_HEART_EYES_UNICODE = String.fromCodePoint(
  parseInt('1F60D', 16),
);
const GRINNING_WITH_SMILE_UNICODE = String.fromCodePoint(parseInt('1F604', 16));
const CRYING_FACE_UNICODE = String.fromCodePoint(parseInt('1F622', 16));

const Touchable = Platform.select<any>({
  android: TouchableNativeFeedback,
  default: TouchableOpacity,
});

const touchableProps: any = {};
if (Platform.OS === 'android') {
  touchableProps.background = TouchableNativeFeedback.SelectableBackground();
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },

  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 2,
  },

  buttonsContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.textLine,
    flex: 3,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },

  quickEmojiPickerModal: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1,
  },

  quickEmojiPickerBackground: {
    backgroundColor: Palette.isDarkTheme
      ? Palette.transparencyDarkStrong
      : Palette.transparencyDark,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },

  quickEmojiPickerContainer: {
    backgroundColor: Palette.backgroundText,
    borderRadius: Dimensions.borderRadiusBig,
    marginHorizontal: Dimensions.horizontalSpaceNormal,
    marginVertical: Dimensions.verticalSpaceNormal,
    paddingHorizontal: Dimensions.horizontalSpaceNormal,
    paddingVertical: Dimensions.verticalSpaceNormal,
    flexDirection: 'column',
    ...Platform.select({
      web: {
        width: '50vw',
        marginHorizontal: '25vw',
      },
    }),
  },

  quickEmojiPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quickEmojiChoiceTouchable: {
    minWidth: 60,
    height: 60,
    minHeight: 60,
    width: 60,
    flex: 0,
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickEmojiChoice: {
    fontSize: 30,
    fontFamily: Platform.select({web: Typography.fontFamilyReadableText}),
  },

  fullEmojiModalBackground: {
    backgroundColor: Palette.isDarkTheme
      ? Palette.transparencyDarkStrong
      : Palette.transparencyDark,
  },

  fullEmojiModalContainer: {
    backgroundColor: Palette.backgroundText,
  },

  fullEmojiModalScroll: {
    paddingTop: Dimensions.verticalSpaceTiny,
    paddingHorizontal: Dimensions.horizontalSpaceNormal,
    paddingBottom: Dimensions.verticalSpaceNormal,
  },

  fullEmojiModalHeader: {
    fontSize: Typography.fontSizeSmall,
    fontFamily: Typography.fontFamilyReadableText,
    fontWeight: 'bold',
    color: Palette.textWeak,
  },

  fullEmojiModalSearch: {
    backgroundColor: Palette.backgroundTextWeak,
    color: Palette.textWeak,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },

  fullEmojiModalEmoji: {
    ...Platform.select({
      web: {
        fontFamily: Typography.fontFamilyReadableText,
      },
    }),
  },

  reactionsTouchable: {
    ...Platform.select({
      web: {
        width: '100%',
      },
    }),
  },

  reactions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  reactionsText: {
    minWidth: 60,
    fontSize: Typography.fontSizeSmall,
    lineHeight: Typography.lineHeightSmall,
    fontFamily: Typography.fontFamilyReadableText,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'left',
    color: Palette.textWeak,
  },

  repliesCounter: {
    marginRight: Dimensions.horizontalSpaceTiny,
    fontSize: Typography.fontSizeNormal,
    fontFamily: Typography.fontFamilyReadableText,
    textAlignVertical: 'center',
    textAlign: 'right',
    color: Palette.textWeak,
  },

  myReaction: {
    color: Palette.text,
    fontSize: Typography.fontSizeBig,
    fontFamily: Platform.select({web: Typography.fontFamilyReadableText}),
    lineHeight: Typography.lineHeightSmall,
  },

  prominentButtonContainer: Platform.select({
    web: {
      width: '80px',
    },
    default: {
      flex: 1,
    },
  }),

  prominentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Reactions extends PureComponent<{
  onPress: () => void;
  reactions: NonNullable<ReactionsType>;
}> {
  public render() {
    const {reactions, onPress} = this.props;
    const count = reactions.length;
    const summary = reactions.map(([_feed, reaction]) => reaction).join('');

    const child = [
      h(View, {style: styles.reactions, pointerEvents: 'box-only'}, [
        h(
          Text,
          {
            style: styles.reactionsText,
            numberOfLines: 1,
            ellipsizeMode: 'tail',
          },
          count > 0 ? summary : ' ',
        ),
      ]),
    ];

    if (count > 0) {
      return h(
        Touchable,
        {
          ...touchableProps,
          style: styles.reactionsTouchable,
          onPress,
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: t(
            'message.call_to_action.show_reactions.accessibility_label',
          ),
        },
        child,
      );
    } else {
      return h(Fragment, child);
    }
  }
}

class AddReactionButton extends PureComponent<{
  onPress: () => void;
  myReaction: string | null;
}> {
  public render() {
    const {myReaction} = this.props;

    return h(
      Touchable,
      {
        ...touchableProps,
        style: styles.prominentButtonContainer,
        onPress: this.props.onPress,
        delayLongPress: 100,
        delayPressIn: 20,
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: t(
          'message.call_to_action.add_reaction.accessibility_label',
        ),
      },
      [
        h(View, {style: styles.prominentButton, pointerEvents: 'box-only'}, [
          myReaction === null
            ? h(Icon, {
                key: 'icon',
                size: Dimensions.iconSizeSmall,
                color: Palette.textWeak,
                name: 'emoticon-happy-outline',
              })
            : h(Text, {key: 'm', style: styles.myReaction}, myReaction),
        ]),
      ],
    );
  }
}

class ReplyButton extends PureComponent<{
  onPress?: () => void;
  enabled: boolean;
  replyCount: number;
}> {
  public render() {
    const {replyCount, enabled} = this.props;

    if (enabled) {
      return h(
        Touchable,
        {
          ...touchableProps,
          style: styles.prominentButtonContainer,
          onPress: this.props.onPress,
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: t(
            'message.call_to_action.reply.accessibility_label',
          ),
        },
        [
          h(View, {style: styles.prominentButton, pointerEvents: 'box-only'}, [
            replyCount > 0
              ? h(
                  Text,
                  {
                    key: 't',
                    style: styles.repliesCounter,
                    numberOfLines: 1,
                  },
                  String(replyCount),
                )
              : null,
            h(Icon, {
              key: 'icon',
              size: Dimensions.iconSizeSmall,
              color: Palette.textWeak,
              name: 'comment-outline',
            }),
          ]),
        ],
      );
    } else {
      return h(View, {style: styles.prominentButton}, [
        h(Icon, {
          key: 'icon',
          size: Dimensions.iconSizeSmall,
          color: Palette.textVeryWeak,
          name: 'comment-outline',
        }),
      ]);
    }
  }
}

class EtcButton extends PureComponent<{onPress: () => void}> {
  public render() {
    return h(
      Touchable,
      {
        ...touchableProps,
        style: styles.prominentButtonContainer,
        onPress: this.props.onPress,
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: t('message.call_to_action.etc.accessibility_label'),
      },
      [
        h(View, {style: styles.prominentButton, pointerEvents: 'box-only'}, [
          h(Icon, {
            size: Dimensions.iconSizeNormal,
            color: Palette.textWeak,
            name: 'dots-horizontal',
          }),
        ]),
      ],
    );
  }
}

export interface Props {
  msg: Msg;
  selfFeedId: FeedId;
  reactions: ReactionsType;
  replyCount: number;
  style?: ViewStyle;
  onPressReactions?: (ev: PressReactionsEvent) => void;
  onPressAddReaction?: (ev: PressAddReactionEvent) => void;
  onPressReply?: () => void;
  onPressEtc?: (msg: Msg) => void;
}

interface State {
  showQuickEmojis: boolean;
  showFullEmojis: boolean;
}

export default class MessageFooter extends Component<Props, State> {
  public state = {
    showQuickEmojis: false,
    showFullEmojis: false,
  };

  /**
   * in pixels
   */
  public static HEIGHT = 75;

  private myReaction: string | null = null;

  private onPressReactionsHandler = () => {
    this.props.onPressReactions?.({
      msgKey: this.props.msg.key,
      reactions: this.props.reactions,
    });
  };

  private onPressAddReactionHandler = () => {
    if (this.myReaction === null) {
      this.setState((prev) => ({showQuickEmojis: !prev.showQuickEmojis}));
    } else {
      this.props.onPressAddReaction?.({
        msgKey: this.props.msg.key,
        value: 0,
        reaction: null,
      });
    }
  };

  private openFullEmojiModal = () => {
    this.setState({showQuickEmojis: false, showFullEmojis: true});
  };

  private closeEmojisModal = () => {
    this.setState({showQuickEmojis: false, showFullEmojis: false});
  };

  private onSelectEmojiReaction = (emoji: string | null) => {
    if (emoji) {
      this.props.onPressAddReaction?.({
        msgKey: this.props.msg.key,
        value: 1,
        reaction: emoji,
      });
    }
    this.setState({showQuickEmojis: false, showFullEmojis: false});
  };

  private onPressEtcHandler = () => {
    this.props.onPressEtc?.(this.props.msg);
  };

  private findMyLatestReaction(): string | null {
    const reactions = this.props.reactions;
    if (!reactions) return null;
    const selfFeedId = this.props.selfFeedId;
    for (let i = reactions.length - 1; i >= 0; i--) {
      if (reactions[i][0] === selfFeedId) {
        return reactions[i][1];
      }
    }
    return null;
  }

  public shouldComponentUpdate(nextP: Props, nextS: State) {
    const prevP = this.props;
    const prevS = this.state;
    if (nextP.msg.key !== prevP.msg.key) return true;
    if (nextS.showQuickEmojis !== prevS.showQuickEmojis) return true;
    if (nextS.showFullEmojis !== prevS.showFullEmojis) return true;
    if (nextP.onPressReply !== prevP.onPressReply) return true;
    if (nextP.replyCount !== prevP.replyCount) return true;
    if ((nextP.reactions ?? []).length !== (prevP.reactions ?? []).length) {
      return true;
    }
    if (
      // Check that the latest (the first entry) is
      // from the same author but has changed the emoji
      nextP.reactions &&
      prevP.reactions &&
      nextP.reactions.length > 0 &&
      prevP.reactions.length > 0 &&
      nextP.reactions[0][0] === prevP.reactions[0][0] &&
      nextP.reactions[0][1] !== prevP.reactions[0][1]
    ) {
      return true;
    }
    // Deep comparison
    if (JSON.stringify(nextP.reactions) !== JSON.stringify(prevP.reactions)) {
      return true;
    }

    return false;
  }

  private renderQuickEmojiChoice(emoji: string) {
    const child = h(Text, {style: styles.quickEmojiChoice}, emoji);

    return h(
      Touchable,
      {
        ...touchableProps,
        onPress: () => this.onSelectEmojiReaction(emoji),
        style: Platform.OS === 'web' ? styles.quickEmojiChoiceTouchable : null,
        accessible: true,
        accessibilityRole: 'button',
      },
      [
        Platform.OS === 'web'
          ? child
          : h(View, {style: styles.quickEmojiChoiceTouchable}, [child]),
      ],
    );
  }

  private renderShowAllEmojisChoice() {
    const child = h(Icon, {
      style: styles.quickEmojiChoice,
      key: 'showall',
      color: Palette.textWeak,
      name: 'dots-horizontal',
    });

    return h(
      Touchable,
      {
        ...touchableProps,
        style: Platform.OS === 'web' ? styles.quickEmojiChoiceTouchable : null,
        onPress: this.openFullEmojiModal,
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: t(
          'message.reactions.show_more.accessibility_label',
        ),
      },
      [
        Platform.OS === 'web'
          ? child
          : h(View, {style: styles.quickEmojiChoiceTouchable}, [child]),
      ],
    );
  }

  private renderQuickEmojiPickerModal() {
    return h(View, {style: styles.quickEmojiPickerModal}, [
      h(View, {style: styles.quickEmojiPickerContainer}, [
        h(View, {style: styles.quickEmojiPickerRow}, [
          this.renderQuickEmojiChoice(THUMBS_UP_UNICODE),
          this.renderQuickEmojiChoice(VICTORY_HAND_UNICODE),
          this.renderQuickEmojiChoice(HEART_UNICODE),
          this.renderQuickEmojiChoice(SEE_NO_EVIL_MONKEY_UNICODE),
        ]),
        h(View, {style: styles.quickEmojiPickerRow}, [
          this.renderQuickEmojiChoice(SMILING_WITH_HEART_EYES_UNICODE),
          this.renderQuickEmojiChoice(GRINNING_WITH_SMILE_UNICODE),
          this.renderQuickEmojiChoice(CRYING_FACE_UNICODE),
          this.renderShowAllEmojisChoice(),
        ]),
      ]),
      h(TouchableWithoutFeedback, {onPress: this.closeEmojisModal}, [
        h(View, {style: styles.quickEmojiPickerBackground}),
      ]),
    ]);
  }

  private renderFullEmojiModal() {
    return h(EmojiModal, {
      onEmojiSelected: this.onSelectEmojiReaction,
      onPressOutside: this.closeEmojisModal,
      columns: 7,
      localizedCategories: [
        t('message.reactions.categories.smileys_and_emotion'),
        t('message.reactions.categories.people_and_body'),
        t('message.reactions.categories.animals_and_nature'),
        t('message.reactions.categories.food_and_drink'),
        t('message.reactions.categories.activities'),
        t('message.reactions.categories.travel_and_places'),
        t('message.reactions.categories.objects'),
        t('message.reactions.categories.symbols'),
        t('message.reactions.categories.flags'),
      ],
      backgroundStyle: styles.fullEmojiModalBackground,
      containerStyle: styles.fullEmojiModalContainer,
      scrollStyle: styles.fullEmojiModalScroll,
      headerStyle: styles.fullEmojiModalHeader,
      emojiStyle: styles.fullEmojiModalEmoji,
      searchStyle: styles.fullEmojiModalSearch,
      shortcutColor: Palette.isDarkTheme
        ? Palette.textWeak
        : Palette.textVeryWeak,
      activeShortcutColor: Palette.textBrand,
    });
  }

  public render() {
    const props = this.props;
    const shouldShowReply = !!props.onPressReply;
    const reactions = props.reactions ?? [];
    const replyCount = props.replyCount;
    this.myReaction = this.findMyLatestReaction();

    return h(View, {style: [styles.container, props.style]}, [
      h(
        Modal,
        {
          animationType: 'none',
          transparent: true,
          hardwareAccelerated: true,
          visible: this.state.showQuickEmojis || this.state.showFullEmojis,
          onRequestClose: this.closeEmojisModal,
        },
        [
          this.state.showQuickEmojis
            ? this.renderQuickEmojiPickerModal()
            : this.renderFullEmojiModal(),
        ],
      ),

      h(View, {key: 'summary', style: styles.reactionsContainer}, [
        h(Reactions, {reactions, onPress: this.onPressReactionsHandler}),
      ]),

      h(View, {key: 'buttons', style: styles.buttonsContainer}, [
        h(AddReactionButton, {
          key: 'react',
          onPress: this.onPressAddReactionHandler,
          myReaction: this.myReaction,
        }),

        h(ReplyButton, {
          key: 'reply',
          replyCount,
          enabled: shouldShowReply,
          onPress: props.onPressReply,
        }),

        h(EtcButton, {key: 'etc', onPress: this.onPressEtcHandler}),
      ]),
    ]);
  }
}
