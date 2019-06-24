import React, { Component, Suspense } from 'react'
import ReactDOM from 'react-dom'

import * as styledComponents from 'styled-components'
import { Flex, Spinner, StyleProvider } from '@repay/cactus-web'
import { Router } from '@reach/router'
import cactusTheme, { CactusTheme } from '@repay/cactus-theme'

const ButtonsPage = React.lazy(() =>
  import(/* webpackChunkName: "Buttons" */ './containers/Buttons')
)
const HomePage = React.lazy(() => import(/* webpackChunkName: "Home" */ './containers/Home'))
const InverseButtonsPage = React.lazy(() =>
  import(/* webpackChunkName: "InverseButtons" */ './containers/InverseButtons')
)
const FormExample = React.lazy(() =>
  import(/* webpackChunkName: "FormExample" */ './containers/FormExample')
)
const Icons = React.lazy(() => import(/* webpackChunkName: "Icons" */ './containers/Icons'))

const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<
  CactusTheme
>

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
document.body.appendChild(appRoot)

const GlobalStyle = createGlobalStyle`
  html,
  body {
    min-height: 100vh;
    overflow: auto;
  }
`

class RootTheme extends Component {
  render() {
    return (
      <StyleProvider theme={cactusTheme} global>
        <Suspense
          fallback={
            <Flex width="100%" justifyContent="center" p={4}>
              <Spinner />
            </Flex>
          }
        >
          <GlobalStyle />
          <Router style={{ height: '100%' }}>
            <HomePage path="/" />
            <ButtonsPage path="/Buttons/Standard" />
            <InverseButtonsPage path="/Buttons/Inverse" />
            <FormExample path="/FormElements" />
            <Icons path="/Icons" />
          </Router>
        </Suspense>
      </StyleProvider>
    )
  }
}

ReactDOM.render(<RootTheme />, appRoot)
