import React from 'react'

import * as styledComponents from 'styled-components'
import { Omit } from '../types'
import cactusTheme, { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'

interface Env {
  NODE_ENV: string
}

interface Process {
  env: Env
}

declare var process: Process

const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<
  CactusTheme
>

const DebugStyle = createGlobalStyle`
  body {
    --reach-tooltip: 1;
  }
`

const breakpoints = ['768px', '1024px', '1200px', '1440px']

const queries = {
  small: `@media screen and (min-width: ${breakpoints[0]})`,
  medium: `@media screen and (min-width: ${breakpoints[1]})`,
  large: `@media screen and (min-width: ${breakpoints[2]})`,
  extraLarge: `@media screen and (min-width: ${breakpoints[3]})`,
}

const GlobalStyle = createGlobalStyle`
html,
body {
  font-family: Helvetica, Arial, sans-serif;
  ${p => p.theme.textStyles.body};
  font-weight: 400;
  color: ${p => p.theme.colors.darkestContrast};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.54;
  letter-spacing: normal;
  margin: 0;
}

small {
  ${p => p.theme.textStyles.small}
}

h1 {
  ${p => p.theme.textStyles.h1};
}

h2 {
  ${p => p.theme.textStyles.h2};
}

h3 {
  ${p => p.theme.textStyles.h3};
}

h4, h5, h6 {
  ${p => p.theme.textStyles.h4};
}
`

let shouldCheckTheme = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'

const checkThemeProperties = (theme: CactusTheme) => {
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

export const StyleProvider: React.FC<StyleProviderProps> = props => {
  const { global, children, theme: providedTheme, ...themeProviderProps } = props
  shouldCheckTheme && checkThemeProperties(providedTheme || cactusTheme)
  const theme = providedTheme ? providedTheme : cactusTheme
  theme.breakpoints = breakpoints.slice()
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
