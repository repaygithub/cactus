import React, { Component, ChangeEvent } from 'react'
import { I18nText, I18nSection } from '@repay/cactus-fwk'
import { Link, RouteComponentProps } from '@reach/router'

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
            <I18nText get="home-link" />
          </Link>
        </div>
        {this.props.children}
      </>
    )
  }
}

export default App
