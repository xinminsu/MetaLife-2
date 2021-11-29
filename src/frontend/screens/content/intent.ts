// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import {ReactSource} from '@cycle/react';
import {State} from './model';
import {
  GlobalEvent,
  DrawerToggleOnContentScreen,
  ContentChangeTab,
  ContentScrollToTop,
  ContentScreenUpdate,
} from '../../drivers/eventbus';
import sample from 'xstream-sample';

type TabID = State['currentTab'];

export default function intent(
  reactSource: ReactSource,
  globalEventBus: Stream<GlobalEvent>,
  state$: Stream<State>,
) {
  const contentScreenUpdate$ = globalEventBus.filter(
    (event) => event.type === 'contentScreenUpdate',
  ) as Stream<ContentScreenUpdate>;

  const changeTab$ = xs.merge(
    contentScreenUpdate$
      .filter((event) => event.subtype === 'changeTab')
      .map((event) => (event as ContentChangeTab).tab),

    reactSource
      .select('home-tab-button')
      .events('press')
      .mapTo('home' as TabID),

    reactSource
      .select('messages-tab-button')
      .events('press')
      .mapTo('messages' as TabID),

    reactSource
      .select('contacts-tab-button')
      .events('press')
      .mapTo('contacts' as TabID),

    reactSource
      .select('discover-tab-button')
      .events('press')
      .mapTo('discover' as TabID),

    reactSource
      .select('profiles-tab-button')
      .events('press')
      .mapTo('profiles' as TabID),
  );

  const globalScrollToTop$ = contentScreenUpdate$
    .filter((event) => event.subtype === 'scrollToTop')
    .map((event) => (event as ContentScrollToTop).tab);

  const changeTabWithState$ = changeTab$.compose(sampleCombine(state$));

  const scrollToHomeTop$ = xs.merge(
    changeTabWithState$
      .filter(
        ([nextTab, state]) => state.currentTab === 'home' && nextTab === 'home',
      )
      .mapTo(null),

    globalScrollToTop$.filter((tab) => tab === 'home').mapTo(null),
  );

  const scrollToMessagesTop$ = xs.merge(
    changeTabWithState$
      .filter(
        ([nextTab, state]) =>
          state.currentTab === 'messages' && nextTab === 'messages',
      )
      .mapTo(null),

    globalScrollToTop$.filter((tab) => tab === 'messages').mapTo(null),
  );

  const scrollToContactsTop$ = xs.merge(
    changeTabWithState$
      .filter(
        ([nextTab, state]) =>
          state.currentTab === 'contacts' && nextTab === 'contacts',
      )
      .mapTo(null),

    globalScrollToTop$.filter((tab) => tab === 'contacts').mapTo(null),
  );

  const scrollToDiscoverTop$ = xs.merge(
    changeTabWithState$
      .filter(
        ([nextTab, state]) =>
          state.currentTab === 'discover' && nextTab === 'discover',
      )
      .mapTo(null),

    globalScrollToTop$.filter((tab) => tab === 'discover').mapTo(null),
  );

  const scrollToProfilesTop$ = xs.merge(
    changeTabWithState$
      .filter(
        ([nextTab, state]) =>
          state.currentTab === 'profiles' && nextTab === 'profiles',
      )
      .mapTo(null),

    globalScrollToTop$.filter((tab) => tab === 'profiles').mapTo(null),
  );

  const hardwareBackWithState$ = globalEventBus
    .filter((event) => event.type === 'hardwareBackOnContentScreen')
    .compose(sample(state$));

  const closeDrawer$ = hardwareBackWithState$
    .filter((state) => state.isDrawerOpen)
    .mapTo(null);

  const backToHomeTab$ = hardwareBackWithState$
    .filter((state) => !state.isDrawerOpen && state.currentTab !== 'home')
    .mapTo(null);

  const exitApp$ = hardwareBackWithState$
    .filter((state) => !state.isDrawerOpen && state.currentTab === 'home')
    .mapTo(null);

  const drawerToggled$ = globalEventBus
    .filter(
      (event): event is DrawerToggleOnContentScreen =>
        event.type === 'drawerToggleOnContentScreen',
    )
    .map((event) => event.open);

  return {
    changeTab$,
    scrollToHomeTop$,
    scrollToMessagesTop$,
    scrollToContactsTop$,
    scrollToDiscoverTop$,
    scrollToProfilesTop$,
    closeDrawer$,
    backToHomeTab$,
    exitApp$,
    drawerToggled$,
  };
}
