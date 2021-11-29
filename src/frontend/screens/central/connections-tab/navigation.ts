// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import sample from 'xstream-sample';
import {Command} from 'cycle-native-navigation';
import {Screens} from '../../enums';
import {t} from '../../../drivers/localization';
import {navOptions as connectionsScreenNavOpts} from '../../connections-panel/layout';
import {Props as ConnPanelProps} from '../../connections-panel/props';
import {navOptions as instructionsNavOpts} from '../../instructions/layout';
import {makeInstructionsProps as makeFollowStagedManuallyInstructionsProps} from './instructions/follow-staged-manually';
import {Props as InstructionsProps} from '../../instructions/props';
import {State} from './model';

export interface Actions {
  goToConnectionsPanel$: Stream<any>;
  goToConsumeInviteDialog$: Stream<any>;
  goToFollowStagedManuallyDialog$: Stream<any>;
  goToHostSsbRoomDialog$: Stream<any>;
}

export default function navigation(
  actions: Actions,
  state$: Stream<State>,
): Stream<Command> {
  const toConnectionsPanel$ = actions.goToConnectionsPanel$
    .compose(sample(state$))
    .map(
      (state) =>
        ({
          type: 'push',
          layout: {
            component: {
              name: Screens.ConnectionsPanel,
              passProps: {
                selfFeedId: state.selfFeedId,
                selfAvatarUrl: state.selfAvatarUrl,
                peers: state.peers,
                rooms: state.rooms,
                stagedPeers: state.stagedPeers,
              } as ConnPanelProps,
              options: connectionsScreenNavOpts,
            },
          },
        } as Command),
    );

  const toConsumeInviteInstructions$ = actions.goToConsumeInviteDialog$.map(
    () =>
      ({
        type: 'push',
        layout: {
          component: {
            name: Screens.Instructions,
            passProps: {
              title: t('connections.recommendations.consume_invite'),
              content1: t(
                'connections.recommendation_descriptions.consume_invite',
              ),
            } as InstructionsProps,
            options: instructionsNavOpts,
          },
        },
      } as Command),
  );

  const toFollowStagedManuallyInstructions$ =
    actions.goToFollowStagedManuallyDialog$
      .compose(sample(state$))
      .map((state) =>
        xs.of(
          {
            type: 'push',
            layout: {
              component: {
                name: Screens.ConnectionsPanel,
                passProps: {
                  selfFeedId: state.selfFeedId,
                  selfAvatarUrl: state.selfAvatarUrl,
                  peers: state.peers,
                  rooms: state.rooms,
                  stagedPeers: state.stagedPeers,
                } as ConnPanelProps,
                options: connectionsScreenNavOpts,
              },
            },
          } as Command,

          {
            type: 'push',
            layout: {
              component: {
                name: Screens.Instructions,
                passProps: makeFollowStagedManuallyInstructionsProps(state),
                options: instructionsNavOpts,
              },
            },
          } as Command,
        ),
      )
      .flatten();

  return xs.merge(
    toConnectionsPanel$,
    toConsumeInviteInstructions$,
    toFollowStagedManuallyInstructions$,
  );
}
