// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {ReactSource} from '@cycle/react';

export default function intent(reactSource: ReactSource) {
  const goToAbout$ = reactSource.select('messages-dialog').events('press');

  return {
    goToAbout$,
  };
}
