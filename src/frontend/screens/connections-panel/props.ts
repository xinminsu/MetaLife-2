// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {FeedId} from 'ssb-typescript';
import {PeerKV, StagedPeerKV} from '../../ssb/types';

export interface Props {
  selfFeedId: FeedId;
  selfAvatarUrl?: string;
  peers: Array<PeerKV>;
  rooms: Array<PeerKV>;
  stagedPeers: Array<StagedPeerKV>;
}
