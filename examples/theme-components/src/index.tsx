import React, { Component, Suspense } from 'react'
import ReactDOM from 'react-dom'
import * as styledComponents from 'styled-components'
import cactusTheme, { CactusTheme } from '@repay/cactus-theme'
import { Router } from '@reach/router'
const ButtonsPage = React.lazy(() =>
  import(/* webpackChunkName: "Buttons" */ './containers/Buttons')
)
const HomePage = React.lazy(() => import(/* webpackChunkName: "Home" */ './containers/Home'))
const InverseButtonsPage = React.lazy(() =>
  import(/* webpackChunkName: "InverseButtons" */ './containers/InverseButtons')
)

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
        <Suspense fallback="loading...">
          <GlobalStyle />
          <Router style={{ height: '100%' }}>
            <HomePage path="/" />
            <ButtonsPage path="/Buttons/Standard" />
            <InverseButtonsPage path="/Buttons/Inverse" />
          </Router>
        </Suspense>
      </ThemeProvider>
    )
  }
}

ReactDOM.render(<RootTheme />, appRoot)
