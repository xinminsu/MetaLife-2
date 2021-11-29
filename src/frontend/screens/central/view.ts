// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {ReactElement, Fragment, PureComponent, Component} from 'react';
import {Platform, View} from 'react-native';
import {h} from '@cycle/react';
import {FloatingAction} from 'react-native-floating-action';
import {IFloatingActionProps as FabProps} from 'react-native-floating-action';
import PublicTabIcon from '../../components/tab-buttons/PublicTabIcon';
import PrivateTabIcon from '../../components/tab-buttons/PrivateTabIcon';
import ActivityTabIcon from '../../components/tab-buttons/ActivityTabIcon';
import ConnectionsTabIcon from '../../components/tab-buttons/ConnectionsTabIcon';
import {styles} from './styles';
import {State} from './model';

class CurrentTabPage extends PureComponent<{
  currentTab: State['currentTab'];
  fab: FabProps;
  publicTab: ReactElement<any>;
  privateTab: ReactElement<any>;
  activityTab: ReactElement<any>;
  connectionsTab: ReactElement<any>;
}> {
  public render() {
    const {
      currentTab,
      fab,
      publicTab,
      privateTab,
      activityTab,
      connectionsTab,
    } = this.props;
    const shown = styles.pageShown;
    const hidden = styles.pageHidden;

    const fabSection =
      Platform.OS === 'web'
        ? h(View, {style: styles.desktopFabContainer}, [h(FloatingAction, fab)])
        : h(FloatingAction, fab);

    return h(Fragment, [
      h(View, {style: [currentTab === 'public' ? shown : hidden]}, [
        publicTab,
        fabSection,
      ]),
      h(View, {style: [currentTab === 'private' ? shown : hidden]}, [
        privateTab,
        fabSection,
      ]),
      h(View, {style: [currentTab === 'activity' ? shown : hidden]}, [
        activityTab,
      ]),
      h(View, {style: [currentTab === 'connections' ? shown : hidden]}, [
        connectionsTab,
        fabSection,
      ]),
    ]);
  }
}

class MobileTabsBar extends Component<State> {
  public shouldComponentUpdate(nextProps: MobileTabsBar['props']) {
    const prevProps = this.props;
    if (nextProps.currentTab !== prevProps.currentTab) return true;
    if (nextProps.numOfPublicUpdates !== prevProps.numOfPublicUpdates) {
      return true;
    }
    if (nextProps.numOfPrivateUpdates !== prevProps.numOfPrivateUpdates) {
      return true;
    }
    if (nextProps.numOfActivityUpdates !== prevProps.numOfActivityUpdates) {
      return true;
    }
    if (nextProps.connectionsTab !== prevProps.connectionsTab) {
      return true;
    }
    if (nextProps.initializedSSB !== prevProps.initializedSSB) {
      return true;
    }
    return false;
  }

  public render() {
    const {currentTab, connectionsTab, initializedSSB} = this.props;

    const status = connectionsTab?.status ?? 'bad';

    return h(View, {style: styles.tabBar}, [
      h(PublicTabIcon, {
        isSelected: currentTab === 'public',
        numOfUpdates: this.props.numOfPublicUpdates,
      }),
      h(PrivateTabIcon, {
        isSelected: currentTab === 'private',
        numOfUpdates: this.props.numOfPrivateUpdates,
      }),
      h(ActivityTabIcon, {
        isSelected: currentTab === 'activity',
        numOfUpdates: this.props.numOfActivityUpdates,
      }),
      h(ConnectionsTabIcon, {
        isSelected: currentTab === 'connections',
        status,
        allowWarningColors: initializedSSB,
      }),
    ]);
  }
}

export default function view(
  state$: Stream<State>,
  fabProps$: Stream<FabProps>,
  topBar$: Stream<ReactElement<any>>,
  publicTab$: Stream<ReactElement<any>>,
  privateTab$: Stream<ReactElement<any>>,
  activityTab$: Stream<ReactElement<any>>,
  connectionsTab$: Stream<ReactElement<any>>,
) {
  return xs
    .combine(
      state$,
      fabProps$,
      topBar$,
      publicTab$.startWith(h(View)),
      privateTab$.startWith(h(View)),
      activityTab$.startWith(h(View)),
      connectionsTab$.startWith(h(View)),
    )
    .map(
      ([
        state,
        fabProps,
        topBar,
        publicTab,
        privateTab,
        activityTab,
        connectionsTab,
      ]) =>
        h(View, {style: styles.root}, [
          // h(RNBridgeDebug),
          topBar,
          h(CurrentTabPage, {
            currentTab: state.currentTab,
            fab: fabProps,
            publicTab,
            privateTab,
            activityTab,
            connectionsTab,
          }),
          Platform.OS === 'web' ? null : h(MobileTabsBar, state),
        ]),
    );
}
