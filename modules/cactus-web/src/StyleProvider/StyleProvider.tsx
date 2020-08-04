import cactusTheme, { CactusTheme, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import * as styledComponents from 'styled-components'

import { breakpointOrder, breakpoints } from '../helpers/constants'
import { textStyle } from '../helpers/theme'
import { Omit } from '../types'

interface Env {
  NODE_ENV: string
}

interface Process {
  env: Env
}

declare let process: Process

const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<
  CactusTheme
>

const DebugStyle = createGlobalStyle`
  body {
    --reach-tooltip: 1;
  }

  :root {
    --reach-dialog: 1;
  }
`

const queries = {
  small: `@media screen and (min-width: ${breakpoints.small}px)`,
  medium: `@media screen and (min-width: ${breakpoints.medium}px)`,
  large: `@media screen and (min-width: ${breakpoints.large}px)`,
  extraLarge: `@media screen and (min-width: ${breakpoints.extraLarge}px)`,
}

const GlobalStyle = createGlobalStyle`
html,
body {
  font-family: ${(p): styledComponents.Interpolation<styledComponents.ThemeProps<CactusTheme>> =>
    p.theme.font as styledComponents.Interpolation<styledComponents.ThemeProps<CactusTheme>>};
  ${(p): styledComponents.FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')};
  font-weight: 400;
  color: ${(p): string => p.theme.colors.darkestContrast};
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  margin: 0;
}

small {
  ${(p): styledComponents.FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'small')}
}

h1 {
  ${(p): styledComponents.FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'h1')};
}

h2 {
  ${(p): styledComponents.FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'h2')};
}

h3 {
  ${(p): styledComponents.FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'h3')};
}

h4, h5, h6 {
  ${(p): styledComponents.FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'h4')};
}
`

let shouldCheckTheme = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'

const checkThemeProperties = (theme: CactusTheme): void => {
  if (theme.colors.transparentCTA === undefined) {
    console.warn(
      "You are using an outdated version of @repay/cactus-theme. Some features won't be available in @repay/cactus-web with this version. Please upgrade to @repay/cactus-theme >= 0.4.3."
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
  theme.breakpoints = breakpointOrder.map((bp): string => `${breakpoints[bp]}px`)
  theme.mediaQueries = queries

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

// @ts-ignore
StyleProvider.propTypes = {
  global: PropTypes.bool,
}

StyleProvider.defaultProps = {
  global: false,
}

export default StyleProvider
