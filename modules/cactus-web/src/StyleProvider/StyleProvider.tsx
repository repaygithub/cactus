import React from 'react'

import * as styledComponents from 'styled-components'
import { Omit } from '../types'
import cactusTheme, { CactusTheme } from '@repay/cactus-theme'

const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<
  CactusTheme
>

const DebugStyle = createGlobalStyle`
  body {
    --reach-tooltip: 1;
  }
`

const GlobalStyle = createGlobalStyle`
html,
body {
  font-family: Helvetica, Arial, sans-serif;
  ${p => p.theme.textStyles.body}
  font-weight: 400;
  color: ${p => p.theme.colors.darkestContrast};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.54;
  letter-spacing: normal;
  margin: 0;
}
`

const checkThemeProperties = (theme: CactusTheme) => {
  if (theme.colors.transparentCTA === undefined) {
    console.warn(
      "You are using an outdated version of @repay/cactus-theme. Some features won't be available in @repay/cactus-web with this version. Please upgrade to @repay/cactus-theme >= 0.4.3."
    )
  }
}

interface StyleProviderProps extends Omit<styledComponents.ThemeProviderProps<any, any>, 'theme'> {
  theme?: CactusTheme
  global?: boolean
}

export const StyleProvider: React.FC<StyleProviderProps> = props => {
  const { global, children, theme, ...themeProviderProps } = props
  checkThemeProperties(theme || cactusTheme)

  return (
    <styledComponents.ThemeProvider theme={theme ? theme : cactusTheme} {...themeProviderProps}>
      <React.Fragment>
        <DebugStyle />
        {global && <GlobalStyle />}
        {children}
      </React.Fragment>
    </styledComponents.ThemeProvider>
  )
}

StyleProvider.defaultProps = {
  global: false,
}

export default StyleProvider
