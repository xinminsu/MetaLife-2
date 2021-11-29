// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import {StateSource, Reducer} from '@cycle/state';
import {ReactElement} from 'react';
import {ReactSource} from '@cycle/react';
import {AsyncStorageSource} from 'cycle-native-asyncstorage';
import {Command, NavSource} from 'cycle-native-navigation';
import {SSBSource, Req} from '../../drivers/ssb';
import {Command as AlertCommand, DialogSource} from '../../drivers/dialogs';
import {Toast, Duration as ToastDuration} from '../../drivers/toast';
import {t} from '../../drivers/localization';
import messageEtc from '../../components/messageEtc';
import manageContact from './manage-contact';
import copyCypherlink from './copy-cypherlink';
import intent from './intent';
import model, {State} from './model';
import view from './view';
import ssb from './ssb';
import navigation from './navigation';
import alert from './alert';
export {navOptions} from './layout';
import {Props as P} from './props';

export type Props = P;

export type Sources = {
  props: Stream<Props>;
  screen: ReactSource;
  navigation: NavSource;
  state: StateSource<State>;
  asyncstorage: AsyncStorageSource;
  ssb: SSBSource;
  dialog: DialogSource;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  state: Stream<Reducer<State>>;
  clipboard: Stream<string>;
  toast: Stream<Toast>;
  dialog: Stream<AlertCommand>;
  ssb: Stream<Req>;
};

export function profile(sources: Sources): Sinks {
  const state$ = sources.state.stream;

  const actions = intent(sources.screen, sources.navigation, state$);

  const messageEtcSinks = messageEtc({
    appear$: actions.openMessageEtc$,
    dialog: sources.dialog,
  });

  const feedId$ = state$
    .map((state) => state.displayFeedId)
    .compose(dropRepeats());

  const manageContactSinks = manageContact({
    feedId$,
    manageContact$: actions.manageContact$,
    dialog: sources.dialog,
  });

  const copyCypherlinkSinks = copyCypherlink({
    feedId$,
    appear$: actions.goToFeedId$,
    dialog: sources.dialog,
  });

  const actionsPlus = {
    ...actions,
    ...manageContactSinks,
    ...copyCypherlinkSinks,
    goToRawMsg$: messageEtcSinks.goToRawMsg$,
  };

  const reducer$ = model(
    actionsPlus,
    sources.asyncstorage,
    sources.props,
    sources.ssb,
  );

  const vdom$ = view(state$, sources.ssb);

  const newContent$ = ssb(actionsPlus, state$);

  const command$ = navigation(
    actionsPlus,
    sources.ssb,
    sources.navigation,
    state$,
  );

  const clipboard$ = xs.merge(
    messageEtcSinks.clipboard,
    copyCypherlinkSinks.clipboard,
  );

  const alert$ = alert(state$);

  const consumeAliasRequest$ = actions.consumeAlias$.map(
    ({alias}) =>
      ({
        type: 'show' as const,
        message: t('connections.toasts.connecting_to_alias', {alias}),
        duration: ToastDuration.SHORT,
      } as Toast),
  );

  const consumeAliasResponse$ = actions.consumeAlias$
    .map(({alias}) =>
      sources.ssb
        .consumeAlias$(alias)
        .map(
          () =>
            ({
              type: 'show' as const,
              flavor: 'success',
              message: t('connections.toasts.connected_to_alias', {alias}),
              duration: ToastDuration.SHORT,
            } as Toast),
        )
        .replaceError(() =>
          xs.of({
            type: 'show' as const,
            flavor: 'failure',
            message: t('connections.toasts.not_connected_to_alias', {alias}),
            duration: ToastDuration.SHORT,
          } as Toast),
        ),
    )
    .flatten();

  const toast$ = xs.merge(
    messageEtcSinks.toast,
    copyCypherlinkSinks.toast,
    consumeAliasRequest$,
    consumeAliasResponse$,
  );

  return {
    screen: vdom$,
    navigation: command$,
    state: reducer$,
    dialog: alert$,
    clipboard: clipboard$,
    toast: toast$,
    ssb: newContent$,
  };
}
