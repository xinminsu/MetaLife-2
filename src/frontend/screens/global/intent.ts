// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {
  isFeedSSBURI,
  isMessageSSBURI,
  isAddressSSBURI,
  isExperimentalSSBURIWithAction,
  toFeedSigil,
  toMultiserverAddress,
  toMessageSigil,
} from 'ssb-uri2';
import {
  GlobalEvent,
  TriggerFeedCypherlink,
  TriggerHashtagLink,
  TriggerMsgCypherlink,
} from '../../drivers/eventbus';
import {SSBSource} from '../../drivers/ssb';
import {DialogSource} from '../../drivers/dialogs';
import {t} from '../../drivers/localization';
import {Palette} from '../../global-styles/palette';
const Ref = require('ssb-ref');
const urlParse = require('url-parse');

export default function intent(
  globalEventBus: Stream<GlobalEvent>,
  linkingSource: Stream<string>,
  dialogSource: DialogSource,
  ssbSource: SSBSource,
) {
  const canNowHandleLinks$ = ssbSource.connStarted$;

  const link$ = canNowHandleLinks$
    .map(() => linkingSource)
    .flatten()
    .remember();

  const handleUriClaimInvite$ = link$.filter(
    isExperimentalSSBURIWithAction('claim-http-invite'),
  );

  const handleUriStartHttpAuth$ = link$.filter(
    isExperimentalSSBURIWithAction('start-http-auth'),
  );

  const handleUriConsumeAlias$ = link$.filter(
    isExperimentalSSBURIWithAction('consume-alias'),
  );

  const handleUriFeed$ = link$.filter(isFeedSSBURI);

  const handleUriMsg$ = link$.filter(isMessageSSBURI);

  const handleUriAddress$ = link$.filter(isAddressSSBURI);

  const connectToPeer$ = handleUriAddress$.map(toMultiserverAddress) as Stream<
    string
  >;

  // Server-initiated SSB HTTP Auth
  const confirmedSignInRoom$ = handleUriStartHttpAuth$
    .map((uri) => {
      const query = urlParse(uri, true).query;
      const msaddr = query.multiserverAddress;
      const room = msaddr ? Ref.toAddress(msaddr).host : '';
      const roomid = query.sid && Ref.isFeed(query.sid) ? query.sid : false;
      if (!roomid) return xs.never();

      return dialogSource
        .alert(
          t('connections.dialogs.sign_in_with_ssb.server_initiated.title'),
          t(
            'connections.dialogs.sign_in_with_ssb.server_initiated.description',
            {room, roomid},
          ),
          {
            ...Palette.dialogColors,
            positiveText: t('call_to_action.yes'),
            negativeText: t('call_to_action.no'),
          },
        )
        .filter((res) => res.action === 'actionPositive')
        .mapTo(uri);
    })
    .flatten();

  const goToProfile$ = xs.merge(
    globalEventBus
      .filter((ev) => ev.type === 'triggerFeedCypherlink')
      .map((ev) => ({authorFeedId: (ev as TriggerFeedCypherlink).feedId})),

    handleUriFeed$
      .map((uri) => {
        const authorFeedId = toFeedSigil(uri);
        if (!Ref.isFeed(authorFeedId)) return null;
        return {authorFeedId};
      })
      .filter((x) => !!x) as Stream<{authorFeedId: string}>,
  );

  const goToThread$ = xs.merge(
    globalEventBus
      .filter((ev) => ev.type === 'triggerMsgCypherlink')
      .map((ev) => ({rootMsgId: (ev as TriggerMsgCypherlink).msgId})),

    handleUriMsg$
      .map((uri) => {
        const rootMsgId = toMessageSigil(uri);
        if (!Ref.isMsg(rootMsgId)) return null;
        return {rootMsgId};
      })
      .filter((x) => !!x) as Stream<{rootMsgId: string}>,
  );

  const goToSearch$ = (globalEventBus.filter(
    (ev) => ev.type === 'triggerHashtagLink',
  ) as Stream<TriggerHashtagLink>).map((ev) => ({query: ev.hashtag}));

  return {
    handleUriClaimInvite$,
    handleUriConsumeAlias$,
    handleUriStartHttpAuth$,
    connectToPeer$,
    confirmedSignInRoom$,
    goToProfile$,
    goToThread$,
    goToSearch$,
  };
}
