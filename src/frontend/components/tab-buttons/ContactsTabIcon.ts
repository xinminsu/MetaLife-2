// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {h} from '@cycle/react';
import {Component} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {t} from '../../drivers/localization';
import TabIcon from './TabIcon';

export default class ContactsTabIcon extends Component<{
  isSelected: boolean;
  style?: StyleProp<ViewStyle>;
}> {
  public shouldComponentUpdate(nextProps: ContactsTabIcon['props']) {
    const prevProps = this.props;
    if (nextProps.isSelected !== prevProps.isSelected) return true;

    return false;
  }

  public render() {
    const {isSelected, style} = this.props;

    return h(TabIcon, {
      style,
      isSelected,
      sel: 'contacts-tab-button',
      iconName: 'contacts-outline',
      label: t('content.tab_footers.contacts'),
      accessibilityLabel: t('content.tabs.contacts.accessibility_label'),
    });
  }
}
