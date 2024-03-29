import cactusTheme, { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import * as styledComponents from 'styled-components'

import { textStyle } from '../helpers/theme'

interface Env {
  NODE_ENV: string
}

interface Process {
  env: Env
}

declare let process: Process

const { createGlobalStyle } =
  styledComponents as styledComponents.ThemedStyledComponentsModule<CactusTheme>

const DebugStyle = createGlobalStyle`
  :root {
    --reach-dialog: 1;
  }
`

const GlobalStyle = createGlobalStyle`
html,
body,
button,
input,
select,
textarea {
  font-weight: 400;
  color: ${(p): string => p.theme.colors.darkestContrast};
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
}

html,
body,
input,
select,
button,
textarea {
  ${(p) => textStyle(p.theme, 'body')};
  font-family: ${(p) => p.theme.font};
}

html,
body {
  margin: 0;
}

small {
  ${(p) => textStyle(p.theme, 'small')}
}

h1 {
  ${(p) => textStyle(p.theme, 'h1')};
}

h2 {
  ${(p) => textStyle(p.theme, 'h2')};
}

h3 {
  ${(p) => textStyle(p.theme, 'h3')};
}

h4, h5, h6 {
  ${(p) => textStyle(p.theme, 'h4')};
}
`

let shouldCheckTheme = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'

const checkThemeProperties = (theme: CactusTheme): void => {
  if (theme.colors.lightCallToAction === undefined) {
    console.warn(
      "You are using an outdated version of @repay/cactus-theme. Some features won't be available in @repay/cactus-web with this version. Please upgrade to @repay/cactus-theme >= 3.0.0."
    )
  }
  shouldCheckTheme = false
}

interface StyleProviderProps extends Omit<styledComponents.ThemeProviderProps<any, any>, 'theme'> {
  theme?: CactusTheme
  global?: boolean
}

export const StyleProvider: React.FC<StyleProviderProps> = (props): React.ReactElement => {
  const { global, children, theme: providedTheme, ...themeProviderProps } = props
  shouldCheckTheme && checkThemeProperties(providedTheme || cactusTheme)
  const theme = providedTheme ? providedTheme : cactusTheme

  return (
    <styledComponents.ThemeProvider theme={theme} {...themeProviderProps}>
      <React.Fragment>
        <DebugStyle />
        {global && <GlobalStyle />}
        {children}
      </React.Fragment>
    </styledComponents.ThemeProvider>
  )
}

// PropTypes declarations of some recurring types so they can be re-used.
const textStyleObj = PropTypes.shape({
  fontSize: PropTypes.string.isRequired,
  lineHeight: PropTypes.string.isRequired,
}).isRequired
const textStylesObj = PropTypes.shape({
  tiny: textStyleObj,
  small: textStyleObj,
  body: textStyleObj,
  h4: textStyleObj,
  h3: textStyleObj,
  h2: textStyleObj,
  h1: textStyleObj,
}).isRequired
const colorStyleObj = PropTypes.shape({
  color: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
}).isRequired
const statusObj = PropTypes.shape({
  success: PropTypes.string.isRequired,
  warning: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
}).isRequired

const generateArrayValidator = (expectedLength: number) =>
  PropTypes.arrayOf<number>((propValue, key, componentName, _, propFullName) => {
    if (propValue.length !== expectedLength) {
      return new Error(
        `Invalid prop \`${propFullName}\` supplied to \`${componentName}\`. ${propFullName.substring(
          0,
          propFullName.length - 3
        )} must be an array of length ${expectedLength}, but it is length ${propValue.length}.`
      )
    }
    const type = typeof propValue[key]
    if (type !== 'number') {
      return new Error(
        `Invalid prop \`${propFullName}\` of type \`${type}\` supplied to \`${componentName}\`, expected \`number\`.`
      )
    }
    return null
  }).isRequired

StyleProvider.propTypes = {
  global: PropTypes.bool,
  // @ts-ignore
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      base: PropTypes.string.isRequired,
      baseText: PropTypes.string.isRequired,
      callToAction: PropTypes.string.isRequired,
      callToActionText: PropTypes.string.isRequired,
      lightCallToAction: PropTypes.string.isRequired,
      lightContrast: PropTypes.string.isRequired,
      mediumContrast: PropTypes.string.isRequired,
      darkContrast: PropTypes.string.isRequired,
      darkestContrast: PropTypes.string.isRequired,
      white: PropTypes.string.isRequired,
      lightGray: PropTypes.string.isRequired,
      mediumGray: PropTypes.string.isRequired,
      darkGray: PropTypes.string.isRequired,
      success: PropTypes.string.isRequired,
      warning: PropTypes.string.isRequired,
      error: PropTypes.string.isRequired,
      successLight: PropTypes.string.isRequired,
      warningLight: PropTypes.string.isRequired,
      errorLight: PropTypes.string.isRequired,
      successMedium: PropTypes.string.isRequired,
      warningMedium: PropTypes.string.isRequired,
      errorMedium: PropTypes.string.isRequired,
      successDark: PropTypes.string.isRequired,
      warningDark: PropTypes.string.isRequired,
      errorDark: PropTypes.string.isRequired,
      status: PropTypes.shape({
        background: statusObj,
        avatar: statusObj,
      }).isRequired,
    }).isRequired,
    space: generateArrayValidator(8),
    fontSizes: generateArrayValidator(7),
    mobileFontSizes: generateArrayValidator(7),
    iconSizes: generateArrayValidator(4),
    textStyles: textStylesObj,
    mobileTextStyles: textStylesObj,
    colorStyles: PropTypes.shape({
      base: colorStyleObj,
      callToAction: colorStyleObj,
      standard: colorStyleObj,
      lightContrast: colorStyleObj,
      darkestContrast: colorStyleObj,
      success: colorStyleObj,
      error: colorStyleObj,
      warning: colorStyleObj,
      disable: colorStyleObj,
      lightCallToAction: colorStyleObj,
      successLight: colorStyleObj,
      errorLight: colorStyleObj,
      warningLight: colorStyleObj,
      successMedium: colorStyleObj,
      errorMedium: colorStyleObj,
      warningMedium: colorStyleObj,
      successDark: colorStyleObj,
      errorDark: colorStyleObj,
      warningDark: colorStyleObj,
    }).isRequired,
    border: PropTypes.oneOf(['thin', 'thick']).isRequired,
    shape: PropTypes.oneOf(['square', 'intermediate', 'round']).isRequired,
    font: PropTypes.string.isRequired,
    boxShadows: PropTypes.bool.isRequired,
  }),
}

export default StyleProvider
