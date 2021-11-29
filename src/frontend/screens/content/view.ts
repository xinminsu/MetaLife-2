// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {ReactElement, Fragment, PureComponent, Component} from 'react';
import {Platform, View} from 'react-native';
import {h} from '@cycle/react';
import HomeTabIcon from '../../components/tab-buttons/HomeTabIcon';
import MessagesTabIcon from '../../components/tab-buttons/MessagesTabIcon';
import ContactsTabIcon from '../../components/tab-buttons/ContactsTabIcon';
import DiscoverTabIcon from '../../components/tab-buttons/DiscoverTabIcon';
import ProfilesTabIcon from '../../components/tab-buttons/ProfilesTabIcon';
import {styles} from './styles';
import {State} from './model';

class CurrentTabPage extends PureComponent<{
  currentTab: State['currentTab'];
  homeTab: ReactElement<any>;
  messagesTab: ReactElement<any>;
  contactsTab: ReactElement<any>;
  discoverTab: ReactElement<any>;
  profilesTab: ReactElement<any>;
}> {
  public render() {
    const {
      currentTab,
      homeTab,
      messagesTab,
      contactsTab,
      discoverTab,
      profilesTab,
    } = this.props;
    const shown = styles.pageShown;
    const hidden = styles.pageHidden;

    return h(Fragment, [
      h(View, {style: [currentTab === 'home' ? shown : hidden]}, [homeTab]),
      h(View, {style: [currentTab === 'messages' ? shown : hidden]}, [
        messagesTab,
      ]),
      h(View, {style: [currentTab === 'contacts' ? shown : hidden]}, [
        contactsTab,
      ]),
      h(View, {style: [currentTab === 'discover' ? shown : hidden]}, [
        discoverTab,
      ]),
      h(View, {style: [currentTab === 'profiles' ? shown : hidden]}, [
        profilesTab,
      ]),
    ]);
  }
}

class MobileTabsBar extends Component<State> {
  public shouldComponentUpdate(nextProps: MobileTabsBar['props']) {
    const prevProps = this.props;
    if (nextProps.currentTab !== prevProps.currentTab) return true;

    return false;
  }

  public render() {
    const {currentTab} = this.props;

    return h(View, {style: styles.tabBar}, [
      h(HomeTabIcon, {
        isSelected: currentTab === 'home',
      }),
      h(MessagesTabIcon, {
        isSelected: currentTab === 'messages',
      }),
      h(ContactsTabIcon, {
        isSelected: currentTab === 'contacts',
      }),
      h(DiscoverTabIcon, {
        isSelected: currentTab === 'discover',
      }),
      h(ProfilesTabIcon, {
        isSelected: currentTab === 'profiles',
      }),
    ]);
  }
}

export default function view(
  state$: Stream<State>,
  topBar$: Stream<ReactElement<any>>,
  homeTab$: Stream<ReactElement<any>>,
  messagesTab$: Stream<ReactElement<any>>,
  contactsTab$: Stream<ReactElement<any>>,
  discoverTab$: Stream<ReactElement<any>>,
  profilesTab$: Stream<ReactElement<any>>,
) {
  return xs
    .combine(
      state$,
      topBar$,
      homeTab$.startWith(h(View)),
      messagesTab$.startWith(h(View)),
      contactsTab$.startWith(h(View)),
      discoverTab$.startWith(h(View)),
      profilesTab$.startWith(h(View)),
    )
    .map(
      ([
        state,
        topBar,
        homeTab,
        messagesTab,
        contactsTab,
        discoverTab,
        profilesTab,
      ]) =>
        h(View, {style: styles.root}, [
          // h(RNBridgeDebug),
          topBar,
          h(CurrentTabPage, {
            currentTab: state.currentTab,
            homeTab,
            messagesTab,
            contactsTab,
            discoverTab,
            profilesTab,
          }),
          Platform.OS === 'web' ? null : h(MobileTabsBar, state),
        ]),
    );
}
