import React, { Component, ChangeEvent } from 'react'
import ReactDOM from 'react-dom'
import AppRoot from '@repay/cactus-fwk'
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
      <AppRoot withI18n={i18nController} lang={this.state.lang}>
        <Router>
          <App path="/" onLangChange={this.handleLangChange} lang={this.state.lang}>
            <Home path="/" />
            <Coffee path="coffee" />
            <Snacks path="snacks" />
            <Snack path="snacks/:snack" />
          </App>
        </Router>
      </AppRoot>
    )
  }
}

ReactDOM.render(<RootWrapper />, appRoot)
