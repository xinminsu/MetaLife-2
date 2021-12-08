// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import xs, {Stream} from 'xstream';
import {Reducer} from '@cycle/state';

export interface State {
  accountName?: string;
  password?: string;
  confirmPassword?: string;
  pwdPrompt?: string;
  passwordSecurity?: boolean;
  confirmPasswordSecurity?: boolean;
}

export interface Actions {
  updateAccountName$: Stream<string>;
  updatePassword$: Stream<string>;
  updateConfirmPassword$: Stream<string>;
  updatePwdPrompt$: Stream<string>;
  clearAccountName$: Stream<void>;
  updatePasswordSecurity$: Stream<void>;
  updateConfirmPasswordSecurity$: Stream<void>;
}

export default function model(actions: Actions): Stream<Reducer<State>> {
  const initReducer$ = xs.of(function initReducer(prev?: State): State {
    if (prev) return prev;
    return {
      accountName: '',
      password: '',
      confirmPassword: '',
      passwordSecurity: true,
      confirmPasswordSecurity: true,
    };
  });

  const updateAccountNameReducer$ = actions.updateAccountName$.map(
    (text) =>
      function updateWordsReducer(prev: State): State {
        return {
          ...prev,
          accountName: text,
        };
      },
  );

  const updatePasswordReducer$ = actions.updatePassword$.map(
    (text) =>
      function updateWordsReducer(prev: State): State {
        return {
          ...prev,
          password: text,
        };
      },
  );

  const updateConfirmPasswordReducer$ = actions.updateConfirmPassword$.map(
    (text) =>
      function updateWordsReducer(prev: State): State {
        return {
          ...prev,
          confirmPassword: text,
        };
      },
  );

  const updatePwdPromptReducer$ = actions.updatePwdPrompt$.map(
    (text) =>
      function updateWordsReducer(prev: State): State {
        return {
          ...prev,
          pwdPrompt: text,
        };
      },
  );

  const clearAccountNameReducer$ = actions.clearAccountName$.map(
    (text) =>
      function updateWordsReducer(prev: State): State {
        return {
          ...prev,
          accountName: '',
        };
      },
  );

  const updatePasswordSecurityReducer$ = actions.updatePasswordSecurity$.map(
    (text) =>
      function updateWordsReducer(prev: State): State {
        return {
          ...prev,
          passwordSecurity: !prev.passwordSecurity,
        };
      },
  );

  const updateConfirmPasswordSecurityReducer$ =
    actions.updateConfirmPasswordSecurity$.map(
      (text) =>
        function updateWordsReducer(prev: State): State {
          return {
            ...prev,
            confirmPasswordSecurity: !prev.confirmPasswordSecurity,
          };
        },
    );

  return xs.merge(
    initReducer$,
    updateAccountNameReducer$,
    updatePasswordReducer$,
    updateConfirmPasswordReducer$,
    updatePwdPromptReducer$,
    clearAccountNameReducer$,
    updatePasswordSecurityReducer$,
    updateConfirmPasswordSecurityReducer$,
  );
}
