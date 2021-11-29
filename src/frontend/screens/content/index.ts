// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {StateSource, Reducer} from '@cycle/state';
import {ReactElement} from 'react';
import isolate from '@cycle/isolate';
import {ReactSource} from '@cycle/react';
import {Command, NavSource} from 'cycle-native-navigation';
import {GlobalEvent} from '../../drivers/eventbus';
import {DialogSource} from '../../drivers/dialogs';
import {homeTab, Sinks as HomeTabSinks} from './home-tab/index';
import {messagesTab, Sinks as MessagesTabSinks} from './messages-tab/index';
import {contactsTab, Sinks as ContactsTabSinks} from './contacts-tab/index';
import {discoverTab, Sinks as DiscoverTabSinks} from './discover-tab/index';
import {profilesTab, Sinks as ProfilesTabSinks} from './profiles-tab/index';
import {topBar, Sinks as TBSinks} from './top-bar';
import intent from './intent';
import model, {State, topBarLens} from './model';
import view from './view';
import navigation from './navigation';

export type Sources = {
  screen: ReactSource;
  navigation: NavSource;
  globalEventBus: Stream<GlobalEvent>;
  state: StateSource<State>;
  dialog: DialogSource;
};

export type Sinks = {
  screen: Stream<ReactElement<any>>;
  navigation: Stream<Command>;
  state: Stream<Reducer<any>>;
  exit: Stream<any>;
};

export const navOptions = {
  topBar: {
    visible: false,
    drawBehind: true,
    hideOnScroll: false,
    animate: false,
    borderHeight: 0,
    elevation: 0,
    height: 0,
  },
  sideMenu: {
    left: {
      enabled: true,
    },
  },
};

export function content(sources: Sources): Sinks {
  const topBarSinks: TBSinks = isolate(topBar, {
    '*': 'topBar',
    state: topBarLens,
  })(sources);

  const state$ = sources.state.stream;

  const actions = intent(sources.screen, sources.globalEventBus, state$);

  const homeTabSinks = isolate(homeTab, {
    '*': 'homeTab',
  })({
    ...sources,
  }) as HomeTabSinks;

  const messagesTabSinks = isolate(messagesTab, {
    '*': 'messagesTab',
  })({
    ...sources,
  }) as MessagesTabSinks;

  const contactsTabSinks = isolate(contactsTab, {
    '*': 'contactsTab',
  })({
    ...sources,
  }) as ContactsTabSinks;

  const discoverTabSinks = isolate(discoverTab, {
    '*': 'discoverTab',
  })({...sources}) as DiscoverTabSinks;

  const profilesTabSinks = isolate(profilesTab, {
    '*': 'profilesTab',
  })({
    ...sources,
  }) as ProfilesTabSinks;

  const command$ = navigation(
    state$,
    {
      openDrawer$: topBarSinks.menuPress,
      closeDrawer$: actions.closeDrawer$,
    },
    xs.merge(
      homeTabSinks.navigation,
      messagesTabSinks.navigation,
      contactsTabSinks.navigation,
      discoverTabSinks.navigation,
      profilesTabSinks.navigation,
    ),
  );

  const contentReducer$ = model(actions);

  const reducer$ = xs.merge(
    contentReducer$,
    homeTabSinks.state,
    messagesTabSinks.state,
    contactsTabSinks.state,
    discoverTabSinks.state,
    profilesTabSinks.state,
  ) as Stream<Reducer<State>>;

  const vdom$ = view(
    state$,
    topBarSinks.screen,
    homeTabSinks.screen,
    messagesTabSinks.screen,
    contactsTabSinks.screen,
    discoverTabSinks.screen,
    profilesTabSinks.screen,
  );

  return {
    screen: vdom$,
    state: reducer$,
    navigation: command$,
    exit: actions.exitApp$,
  };
}
