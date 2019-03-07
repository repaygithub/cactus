import React, { Component, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import AppRoot from '@repay/cactus-fwk'
import getRoutes from './config/routes'
import i18nController from './i18nController'
import { I18nText } from '@repay/cactus-fwk'
import { Link } from '@reach/router'

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
document.body.appendChild(appRoot)

class RootWrapper extends Component {
  state = {lang: ''}
  handleLangChange = (event: ChangeEvent<HTMLSelectElement>) =>
    this.setState({ lang: event.target.value })
  render() {
    return (
      <AppRoot withI18n={i18nController} lang={this.state.lang}>
        <div>
          <select onChange={this.handleLangChange} value={this.state.lang}>
            <option value="">Use Browser</option>
            <option value="es-MX">🇲🇽 Español</option>
          </select>
          <Link to="/">
            <I18nText get="home-link" />
          </Link>
        </div>
        <div>{this.props.children}</div>
      </AppRoot>
    )
  }
}

ReactDOM.render(<RootWrapper>{getRoutes()}</RootWrapper>, appRoot);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
