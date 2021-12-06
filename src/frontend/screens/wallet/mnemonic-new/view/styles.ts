import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from '../../../../global-styles/dimens';
import {Palette} from '../../../../global-styles/palette';
import {Typography} from '../../../../global-styles/typography';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
  },

  container: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: Palette.voidMain,
  },

  section: {
    backgroundColor: Palette.backgroundText,
    paddingTop: Dimensions.verticalSpaceBig,
    marginBottom: Dimensions.verticalSpaceBig,
    ...Platform.select({
      web: {
        maxWidth: Dimensions.desktopMiddleWidth.vw,
      },
    }),
  },

  sectionTitle: {
    paddingHorizontal: Dimensions.horizontalSpaceBig,
    fontSize: Typography.fontSizeNormal,
    fontFamily: Typography.fontFamilyReadableText,
    fontWeight: 'bold',
    color: Palette.textBrand,
  },

  spacer: {
    height: 1,
    backgroundColor: Palette.voidMain,
  },

  content: {
    fontSize: Typography.fontSizeNormal,
    lineHeight: Typography.lineHeightNormal,
    color: Palette.text,
  },

  button: {
    borderColor: Palette.colors.white,
    ...Platform.select({
      web: {},
      default: {
        marginBottom: 62,
      },
    }),
  },

  buttonText: {
    color: Palette.colors.white,
  },

  ctaButton: {
    backgroundColor: Palette.backgroundCTA,
    marginBottom: Dimensions.verticalSpaceBig,
  },
});
