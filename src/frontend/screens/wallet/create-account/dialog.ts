// SPDX-FileCopyrightText: 2018-2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import sample from 'xstream-sample';
import {DialogSource} from '../../../drivers/dialogs';
import {Palette} from '../../../global-styles/palette';
import {State} from './model';
import {CheckResponse} from '../../../drivers/wallet/types';

type Actions = {
  confirm$: Stream<any>;
};

function renderContent(response: CheckResponse): string {
  const NOT_SAME = 'the password and confirm password is not the same';

  const ACCOUNT_NAME_EMPTY = 'account name should not be empty';

  const PASSWORD_EMPTY = 'password should not be empty';

  const CONFIRM_PASSWORD_EMPTY = 'confirm password should not be empty';

  return response === 'NOT_SAME'
    ? NOT_SAME
    : response === 'ACCOUNT_NAME_EMPTY'
    ? ACCOUNT_NAME_EMPTY
    : response === 'PASSWORD_EMPTY'
    ? PASSWORD_EMPTY
    : response === 'CONFIRM_PASSWORD_EMPTY'
    ? CONFIRM_PASSWORD_EMPTY
    : 'OK';
}

function inputsCheck(state: State): CheckResponse {
  if (state.accountName === '') return 'ACCOUNT_NAME_EMPTY';

  if (state.password === '') return 'PASSWORD_EMPTY';

  if (state.confirmPassword === '') return 'CONFIRM_PASSWORD_EMPTY';

  if (state.password !== state.confirmPassword) return 'NOT_SAME';

  return 'OK';
}

export default function dialog(
  actions: Actions,
  state$: Stream<State>,
  dialogSource: DialogSource,
) {
  const inputsCheckConfirmation$ = actions.confirm$
    .compose(sample(state$))
    .map((state) => inputsCheck(state))
    .map((response: CheckResponse) => {
      const passed = response === 'OK';
      return dialogSource
        .alert(
          passed ? 'inputs is ok' : 'inputs not correct',
          renderContent(response),
          {
            ...Palette.dialogColors,
            positiveColor: Palette.textDialogStrong,
            positiveText: 'ok',
          },
        )
        .mapTo(passed);
    })
    .flatten();

  return xs.merge(inputsCheckConfirmation$);
}
