import React from 'react'

import * as styledComponents from 'styled-components'
import { CactusTheme } from '@repay/cactus-theme'

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
  line-height: 1.56;
  letter-spacing: normal;
}
`

interface StyleProviderProps extends styledComponents.ThemeProviderProps<any, any> {
  global?: boolean
}

export const StyleProvider = (props: StyleProviderProps) => {
  const { global, children, ...themeProviderProps } = props
  return (
    <styledComponents.ThemeProvider {...themeProviderProps}>
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
