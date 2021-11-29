// SPDX-FileCopyrightText: 2020-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PeerKV} from '../types';
import {Callback} from 'pull-stream';
import run = require('promisify-tuple');
import {imageToImageUrl} from '../utils/from-ssb';
import {ClientAPI, AnyFunction} from 'react-native-ssb-client';
import manifest from '../manifest';
const pull = require('pull-stream');
const cat = require('pull-cat');
const backoff = require('pull-backoff');
const switchMap = require('pull-switch-map');

type SSB = ClientAPI<
  typeof manifest & {
    cachedAboutSelf: {
      get: AnyFunction;
      invalidate: AnyFunction;
    };
  }
>;

function augmentPeerWithExtras(ssb: SSB) {
  return async ([addr, peer]: PeerKV, cb: Callback<[string, any]>) => {
    // Fetch name and image
    const [, output] = await run<any>(ssb.cachedAboutSelf.get)(peer.key);
    const name = output.name;
    const imageUrl = imageToImageUrl(output.image);

    // Fetch 'isInDB' boolean
    const [, isInDB] = await run<boolean>(ssb.connUtilsBack.isInDB)(addr);

    cb(null, [addr, {name, imageUrl, isInDB, ...peer}]);
  };
}

function augmentPeersWithExtras(ssb: SSB) {
  return async (kvs: Array<PeerKV>, cb: Callback<Array<PeerKV>>) => {
    const peers: Array<PeerKV> = [];
    for (const kv of kvs) {
      const [err, peer] = await run<any>(augmentPeerWithExtras(ssb))(kv);
      if (err) {
        cb(err);
        return;
      }
      peers.push(peer);
    }
    cb(null, peers);
  };
}

function removeOlderDuplicates(kvs: Array<PeerKV>) {
  // Only allow those that don't have a newer duplicate
  return kvs.filter(([_addr1, peer1]) => {
    const newerDuplicate = kvs.find(([_addr2, peer2]) => {
      if (!peer2.key) return false;
      if (peer2.key !== peer1.key) return false;
      if (peer1.hubUpdated && peer2.hubUpdated) {
        return peer2.hubUpdated > peer1.hubUpdated;
      }
      if (peer1.stagingUpdated && peer2.stagingUpdated) {
        return peer2.stagingUpdated > peer1.stagingUpdated;
      }
      return false;
    });
    return !newerDuplicate;
  });
}

const connUtils = {
  name: 'connUtils' as const,

  init: (ssb: SSB) => {
    return {
      persistentConnect(address: string, data: any, cb: Callback<any>) {
        return ssb.connUtilsBack.persistentConnect(address, data, cb);
      },

      persistentDisconnect(address: string, cb: Callback<any>) {
        return ssb.connUtilsBack.persistentDisconnect(address, cb);
      },

      isInDB(address: string, cb: Callback<boolean>) {
        return ssb.connUtilsBack.isInDB(address, cb);
      },

      peers() {
        return pull(
          ssb.conn.peers(),
          switchMap((peers: Array<PeerKV>) =>
            pull(
              cat([pull.once(0), backoff(2e3, 3.2, 60e3)]), // now, 2, 6, 20, 60
              pull.map(() => peers),
            ),
          ),
          pull.map(removeOlderDuplicates),
          pull.through((peers: Array<PeerKV>) => {
            for (const [, data] of peers) {
              if (data.key) ssb.cachedAboutSelf.invalidate(data.key);
            }
          }),
          pull.asyncMap(augmentPeersWithExtras(ssb)),
        );
      },

      stagedPeers() {
        return pull(
          ssb.conn.stagedPeers(),
          pull.map(removeOlderDuplicates),
          pull.asyncMap(augmentPeersWithExtras(ssb)),
        );
      },
    };
  },
};

export default () => connUtils;
