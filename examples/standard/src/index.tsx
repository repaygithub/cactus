import React, { ChangeEvent, Component } from 'react'
import ReactDOM from 'react-dom'

import * as styledComponents from 'styled-components'
import { Coffee, Home, Snack, Snacks } from './containers/index'
import { Router } from '@reach/router'
import { StyleProvider } from '@repay/cactus-web'
import App from './App'
import AppRoot, { FeatureFlagsObject } from '@repay/cactus-fwk'
import cactusTheme, { CactusTheme } from '@repay/cactus-theme'
import i18nController from './i18nController'
import I18nProvider from '@repay/cactus-i18n'

const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<
  CactusTheme
>

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
document.body.appendChild(appRoot)

class RootWrapper extends Component<{}, { lang: string; features: FeatureFlagsObject }> {
  state = { lang: '', features: {} }

  handleLangChange = (event: ChangeEvent<HTMLSelectElement>) =>
    this.setState({ lang: event.target.value })

  handleChangeFeature = (name: string, enabled: boolean) => {
    this.setState(s => ({ features: { ...s.features, [name]: enabled } }))
  }
  render() {
    return (
      <StyleProvider theme={cactusTheme}>
        <AppRoot featureFlags={this.state.features}>
          <I18nProvider controller={i18nController} lang={this.state.lang}>
            <Router>
              <App
                path="/"
                onLangChange={this.handleLangChange}
                onChangeFeature={this.handleChangeFeature}
                lang={this.state.lang}
              >
                <Home path="/" />
                <Coffee path="coffee" />
                <Snacks path="snacks" />
                <Snack path="snacks/:snack" />
              </App>
            </Router>
          </I18nProvider>
        </AppRoot>
      </StyleProvider>
    )
  }
}

ReactDOM.render(<RootWrapper />, appRoot)
