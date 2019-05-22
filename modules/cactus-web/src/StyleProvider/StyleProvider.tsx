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
  font-size: ${p => p.theme.fontSizes.body};
  font-weight: 400;
  color: ${p => p.theme.colors.darkestContrast};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.54;
  letter-spacing: normal;
  margin: 0;
}
`

interface StyleProviderProps extends Omit<styledComponents.ThemeProviderProps<any, any>, 'theme'> {
  theme?: CactusTheme
  global?: boolean
}

export const StyleProvider: React.FC<StyleProviderProps> = props => {
  const { global, children, theme, ...themeProviderProps } = props
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
