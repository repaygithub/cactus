import React, { Component, ChangeEvent } from 'react'
import { I18nText } from '@repay/cactus-i18n'
import { Link, RouteComponentProps } from '@reach/router'
import Heart from '@repay/cactus-icons/i/status-like'

type AppProps = {
  onLangChange: (event: ChangeEvent<HTMLSelectElement>) => void
  lang: string
}

class App extends Component<RouteComponentProps<AppProps>> {
  render() {
    return (
      <>
        <div>
          <select onChange={this.props.onLangChange} value={this.props.lang}>
            <option value="">Use Browser</option>
            <option value="es-MX">🇲🇽 Español</option>
          </select>
          <Link to="/">
            <Heart />
            <I18nText get="home-link" />
          </Link>
        </div>
        {this.props.children}
      </>
    )
  }
}

export default App
