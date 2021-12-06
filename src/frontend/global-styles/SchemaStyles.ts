// SPDX-FileCopyrightText: 2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

import {StyleSheet} from 'react-native';

const primary = '#29DAD7';
const inactive = '#F1F1F2';
const textHolder = '#4E586E';
const textGray = '#999999';
const btnInactive = '#EEEEEE';
const inputBG = '#F1F1F2';
const white = '#FFF';
const lighter = '#F3F3F3';
const light = '#DAE1E7';
const dark = '#444';
const darker = '#222';
const black = '#000';

export const colorsSchema = {
  primary,
  inactive,
  textHolder,
  textGray,
  btnInactive,
  inputBG,
};

export const colorsBasics = {
  primary,
  white,
  lighter,
  light,
  dark,
  darker,
  black,
};

export const defaultTheme = {
  dark: false,
  colors: {
    background: colorsBasics.lighter,
    border: colorsBasics.lighter,
    card: colorsBasics.white,
    notification: colorsBasics.white,
    primary: colorsBasics.primary,
    text: colorsBasics.dark,
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    background: colorsBasics.black,
    border: colorsBasics.black,
    card: colorsBasics.black,
    notification: colorsBasics.black,
    primary: colorsBasics.primary,
    text: colorsBasics.light,
  },
};

export const stylesDefault = StyleSheet.create({
  BG: {
    backgroundColor: colorsBasics.lighter,
  },
  FG: {
    backgroundColor: colorsBasics.white,
  },
  text: {
    color: colorsBasics.black,
  },
  searchBG: {
    backgroundColor: '#F1F1F2',
  },
  placeholderTextColor: {color: '#B6B7B9'},
});

export const stylesDark = StyleSheet.create({
  BG: {
    backgroundColor: colorsBasics.black,
  },
  FG: {
    backgroundColor: colorsBasics.darker,
  },
  text: {
    color: colorsBasics.white,
  },
  searchBG: {
    backgroundColor: '#111717',
  },
  placeholderTextColor: {color: '#7C7E82'},
});

export const stylesBasics = StyleSheet.create({
  // layout
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignContentCenter: {
    alignContent: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  width100Percent: {
    width: '100%',
  },
  marginTop10: {
    marginTop: 10,
  },
  // base component
  // --btn
  btnActiveBG: {
    borderColor: colorsBasics.primary,
    backgroundColor: colorsBasics.primary,
  },
  btnActiveFG: {
    backgroundColor: colorsBasics.primary,
  },
  btnInactiveBG: {
    borderColor: colorsBasics.primary,
  },
  btnInactiveFG: {
    color: colorsBasics.primary,
  },
  btnDisabledBG: {
    borderColor: colorsSchema.textHolder,
  },
  btnDisabledFG: {
    color: colorsSchema.textHolder,
  },
  // --input
  input: {
    height: 54,
    fontSize: 16,
    marginLeft: 16,
    marginRight: 16,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  // --section
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
