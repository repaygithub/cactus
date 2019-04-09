import React, { Component, ChangeEvent } from 'react'
import ReactDOM from 'react-dom'
import I18nProvider from '@repay/cactus-i18n'
import i18nController from './i18nController'
import { Router } from '@reach/router'
import App from './App'
import { Coffee, Home, Snacks, Snack } from './containers/index'
import AppRoot, { FeatureFlagsObject } from '@repay/cactus-fwk'

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
document.body.appendChild(appRoot)

class RootWrapper extends Component<{}, { lang: string; features: FeatureFlagsObject }> {
  state = { lang: '', features: {} }

  handleLangChange = (event: ChangeEvent<HTMLSelectElement>) =>
    this.setState({ lang: event.target.value })

  handleChangeFeature = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, checked },
    } = event
    this.setState(s => ({ features: { ...s.features, [name]: checked } }))
  }
  render() {
    return (
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
    )
  }
}

ReactDOM.render(<RootWrapper />, appRoot)
