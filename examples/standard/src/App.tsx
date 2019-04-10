import React, { Component, ChangeEvent, CSSProperties } from 'react'
import { I18nText } from '@repay/cactus-i18n'
import { Link, RouteComponentProps } from '@reach/router'
import Heart from '@repay/cactus-icons/i/status-like'

type AppProps = {
  onLangChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onChangeFeature: (event: ChangeEvent<HTMLInputElement>) => void
  lang: string
}

const headerStyles: CSSProperties = { display: 'flex' }

const featureBoxStyles: CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  border: '2px solid #CCC',
  padding: '16px',
}

class App extends Component<RouteComponentProps<AppProps>> {
  render() {
    return (
      <>
        <div style={headerStyles}>
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
        <div style={featureBoxStyles}>
          <div>
            <input
              type="checkbox"
              id="feature-include-carrots"
              name="include_carrot_snacks"
              onChange={this.props.onChangeFeature}
            />{' '}
            <label htmlFor="feature-include-carrots">
              <I18nText get="feature-carrots-label" />
            </label>
          </div>
        </div>
      </>
    )
  }
}

export default App
