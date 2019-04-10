import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as styledComponents from 'styled-components'
import cactusTheme, { CactusTheme } from '@repay/cactus-theme'
import { Router } from '@reach/router'
import { Buttons, Home, InverseButtons } from './containers'

const { ThemeProvider } = styledComponents
const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<
  CactusTheme
>

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
appRoot.style.cssText = 'height:100%;'
document.body.appendChild(appRoot)

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`

class RootTheme extends Component {
  render() {
    return (
      <ThemeProvider theme={cactusTheme}>
        <>
          <GlobalStyle />
          <Router style={{ height: '100%' }}>
            <Home path="/" />
            <Buttons path="/Buttons/Standard" />
            <InverseButtons path="/Buttons/Inverse" />
          </Router>
        </>
      </ThemeProvider>
    )
  }
}

ReactDOM.render(<RootTheme />, appRoot)
