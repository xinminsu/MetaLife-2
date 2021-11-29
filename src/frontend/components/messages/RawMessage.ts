// SPDX-FileCopyrightText: 2018-2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {PureComponent} from 'react';
import {h} from '@cycle/react';
import MessageContainer from './MessageContainer';
import MessageHeader, {Props as HeaderP} from './MessageHeader';
import MessageFooter, {Props as FooterP} from './MessageFooter';
import Metadata from './Metadata';

type Props = HeaderP &
  FooterP & {
    lastSessionTimestamp: number;
  };

export default class RawMessage extends PureComponent<Props> {
  public render() {
    const props = this.props;
    const unread = props.msg.timestamp > props.lastSessionTimestamp;

    return h(MessageContainer, {}, [
      h(MessageHeader, {...props, unread}),
      h(Metadata, props),
      h(MessageFooter, props),
    ]);
  }
}
