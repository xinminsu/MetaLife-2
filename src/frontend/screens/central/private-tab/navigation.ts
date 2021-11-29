// SPDX-FileCopyrightText: 2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import sample from 'xstream-sample';
import {MsgId} from 'ssb-typescript';
import {Command} from 'cycle-native-navigation';
import {Screens} from '../../enums';
import {navOptions as conversationNavOpts} from '../../conversation';
import {Props as ConversationProps} from '../../conversation/props';
import {navOptions as recipientsInputNavOpts} from '../../recipients-input';
import {Props as RecipientsInputProps} from '../../recipients-input/props';
import {State} from './model';

export type Actions = {
  goToConversation$: Stream<MsgId>;
  goToRecipientsInput$: Stream<any>;
};

export default function navigation(
  actions: Actions,
  state$: Stream<State>,
): Stream<Command> {
  const toConversation$ = actions.goToConversation$
    .compose(sampleCombine(state$))
    .map(
      ([ev, state]) =>
        ({
          type: 'push',
          layout: {
            component: {
              name: Screens.Conversation,
              passProps: {
                selfFeedId: state.selfFeedId,
                selfAvatarUrl: state.selfAvatarUrl,
                rootMsgId: ev,
              } as ConversationProps,
              options: conversationNavOpts,
            },
          },
        } as Command),
    );

  const toRecipientsInput$ = actions.goToRecipientsInput$
    .compose(sample(state$))
    .map(
      (state) =>
        ({
          type: 'push',
          layout: {
            component: {
              name: Screens.RecipientsInput,
              passProps: {
                selfFeedId: state.selfFeedId,
                selfAvatarUrl: state.selfAvatarUrl,
              } as RecipientsInputProps,
              options: recipientsInputNavOpts,
            },
          },
        } as Command),
    );

  return xs.merge(toConversation$, toRecipientsInput$);
}
