// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Reducer, Lens} from '@cycle/state';
import {Animated} from 'react-native';
import {State as TopBarState} from './top-bar';
import {State as HomeTabState} from './home-tab/model';
import {State as MessagesTabState} from './messages-tab/model';
import {State as ContactsTabState} from './contacts-tab/model';
import {State as DiscoverTabState} from './discover-tab/model';
import {State as ProfilesTabState} from './profiles-tab/model';

export type State = {
  currentTab: 'home' | 'messages' | 'contacts' | 'discover' | 'profiles';
  scrollHeaderBy: Animated.Value;
  homeTab?: HomeTabState;
  messagesTab?: MessagesTabState;
  contactsTab?: ContactsTabState;
  discoverTab?: DiscoverTabState;
  profilesTab?: ProfilesTabState;

  migrationProgress: number;
  indexingProgress: number;
  isDrawerOpen: boolean;
};

/**
 * Identity lens
 */
export const topBarLens: Lens<State, TopBarState> = {
  get: (parent: State): TopBarState => {
    return parent;
  },

  set: (parent: State, child: TopBarState): State => {
    return parent;
  },
};

export const homeTabLens: Lens<State, HomeTabState> = {
  get: (parent: State): HomeTabState => {
    const isVisible = parent.currentTab === 'home';

    if (parent.homeTab) {
      return {
        ...parent.homeTab,
        isVisible,
      };
    } else {
      return {
        isVisible,
      };
    }
  },

  set: (parent: State, child: HomeTabState): State => {
    return {
      ...parent,
      homeTab: child,
    };
  },
};

export const messagesTabLens: Lens<State, MessagesTabState> = {
  get: (parent: State): MessagesTabState => {
    const isVisible = parent.currentTab === 'messages';

    if (parent.messagesTab) {
      return {...parent.messagesTab, isVisible};
    } else {
      return {
        isVisible,
      };
    }
  },

  set: (parent: State, child: MessagesTabState): State => {
    return {
      ...parent,
      messagesTab: child,
    };
  },
};

export const contactsTabLens: Lens<State, ContactsTabState> = {
  get: (parent: State): ContactsTabState => {
    const isVisible = parent.currentTab === 'contacts';
    if (parent.contactsTab) {
      return {...parent.contactsTab, isVisible};
    } else {
      return {
        isVisible,
      };
    }
  },

  set: (parent: State, child: ContactsTabState): State => {
    return {
      ...parent,
      contactsTab: child,
    };
  },
};

export const discoverTabLens: Lens<State, DiscoverTabState> = {
  get: (parent: State): DiscoverTabState => {
    const isVisible = parent.currentTab === 'discover';
    if (parent.discoverTab) {
      return {...parent.discoverTab, isVisible};
    } else {
      return {
        isVisible,
      };
    }
  },

  set: (parent: State, child: DiscoverTabState): State => {
    return {
      ...parent,
      discoverTab: child,
    };
  },
};

export const profilesTabLens: Lens<State, ProfilesTabState> = {
  get: (parent: State): ProfilesTabState => {
    const isVisible = parent.currentTab === 'profiles';
    if (parent.profilesTab) {
      return {...parent.profilesTab, isVisible};
    } else {
      return {
        isVisible,
      };
    }
  },

  set: (parent: State, child: ProfilesTabState): State => {
    return {
      ...parent,
      profilesTab: child,
    };
  },
};

export type Actions = {
  changeTab$: Stream<State['currentTab']>;
  backToHomeTab$: Stream<null>;
  drawerToggled$: Stream<boolean>;
};

export default function model(actions: Actions): Stream<Reducer<State>> {
  const initReducer$ = xs.of(function initReducer(prev?: State): State {
    if (prev) {
      return prev;
    } else {
      return {
        currentTab: 'home',
        migrationProgress: 0,
        indexingProgress: 0,
        scrollHeaderBy: new Animated.Value(0),
        isDrawerOpen: false,
      };
    }
  });

  const changeTabReducer$ = actions.changeTab$.map(
    (nextTab) =>
      function changeTabReducer(prev: State): State {
        return {...prev, currentTab: nextTab};
      },
  );

  const backToHomeTabReducer$ = actions.backToHomeTab$.map(
    () =>
      function changeTabReducer(prev: State): State {
        return {...prev, currentTab: 'home'};
      },
  );

  const isDrawerOpenReducer$ = actions.drawerToggled$.map(
    (isOpen) =>
      function isDrawerOpenReducer(prev: State): State {
        return {...prev, isDrawerOpen: isOpen};
      },
  );

  return xs.merge(
    initReducer$,
    changeTabReducer$,
    backToHomeTabReducer$,
    isDrawerOpenReducer$,
  );
}
