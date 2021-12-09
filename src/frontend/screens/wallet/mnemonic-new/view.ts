// SPDX-FileCopyrightText: 2020 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {Stream} from 'xstream';
import {h} from '@cycle/react';
import {Text, View, StyleSheet} from 'react-native';
import {State} from './model';
import {Palette} from '../../../global-styles/palette';
import {Dimensions} from '../../../global-styles/dimens';
import TextBullet from '../../../components/TextBullet';
import RoundBtn from '../../../components/RoundBtn';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: Palette.colors.white,
    padding: Dimensions.defaultPadding,
  },
  message: {
    color: Palette.colors.black,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: Dimensions.defaultMargin,
    marginHorizontal: 32,
  },
  mnemonicsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  mnemonic: {
    margin: 4,
  },
  revealContainer: {
    width: '60%',
    justifyContent: 'flex-end',
  },
  buttonsContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    height: 104,
  },
});

const renderMnemonic = (mnemonic: any, index: any) =>
  h(View, {style: styles.mnemonic, key: index}, [h(TextBullet, {}, mnemonic)]);

function renderBody(state: State) {
  const mnemonics = state.mnemonic?.split(' ');
  if (!mnemonics) {
    return h(RoundBtn, {
      style: styles.revealContainer,
      seltag: 'generate-mnemonics',
      title: 'Reveal',
      disabled: false,
    });
  }
  return h(
    View,
    {style: styles.mnemonicsContainer},
    mnemonics?.map(renderMnemonic),
  );
}

export default function view(state$: Stream<State>) {
  return state$.map((state) =>
    h(View, {style: styles.container}, [
      h(
        Text,
        {style: styles.message},
        'Save carefully your sequence of mnemonics',
      ),
      renderBody(state),
      h(View, {style: styles.buttonsContainer}, [
        h(RoundBtn, {
          seltag: 'process-button',
          title: 'Proceed',
          disabled: false,
        }),
      ]),
    ]),
  );
}
