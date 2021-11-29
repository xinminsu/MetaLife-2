// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Req} from '../../drivers/ssb';
const roomUtils = require('ssb-room-client/utils');

export type Actions = {
  roomDone$: Stream<string>;
  normalDone$: Stream<string>;
};

export default function ssb(actions: Actions) {
  const acceptInvite$ = actions.normalDone$.map(
    (inviteCode) =>
      ({
        type: 'invite.accept',
        invite: inviteCode,
      } as Req),
  );

  const acceptRoomInvite$ = actions.roomDone$.map(
    (inviteCode) =>
      ({
        type: 'conn.rememberConnect',
        address: roomUtils.inviteToAddress(inviteCode),
        data: {type: 'room'},
      } as Req),
  );

  return xs.merge(acceptInvite$, acceptRoomInvite$);
}
