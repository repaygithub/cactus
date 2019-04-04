import React, { Component, ChangeEvent } from 'react'
import ReactDOM from 'react-dom'
import I18nProvider from '@repay/cactus-i18n'
import i18nController from './i18nController'
import { Router } from '@reach/router'
import App from './App'
import { Coffee, Home, Snacks, Snack } from './containers/index'

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
document.body.appendChild(appRoot)

class RootWrapper extends Component {
  state = { lang: '' }
  handleLangChange = (event: ChangeEvent<HTMLSelectElement>) =>
    this.setState({ lang: event.target.value })
  render() {
    return (
      <I18nProvider controller={i18nController} lang={this.state.lang}>
        <Router>
          <App path="/" onLangChange={this.handleLangChange} lang={this.state.lang}>
            <Home path="/" />
            <Coffee path="coffee" />
            <Snacks path="snacks" />
            <Snack path="snacks/:snack" />
          </App>
        </Router>
      </I18nProvider>
    )
  }
}

ReactDOM.render(<RootWrapper />, appRoot)
