import React, { ChangeEvent, Component, CSSProperties } from 'react'

import { I18nResource, I18nText } from '@repay/cactus-i18n'
import { Link, RouteComponentProps } from '@reach/router'
import { ToggleField } from '@repay/cactus-web'
import { withFeatureFlags } from '@repay/cactus-fwk'
import Heart from '@repay/cactus-icons/i/status-like'

type AppProps = {
  onLangChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onChangeFeature: (name: string, enabled: boolean) => void
  lang: string
  include_carrot_snacks?: boolean
  children?: React.ReactNode
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
            <I18nResource get="feature-carrots-label">
              {label => (
                <ToggleField
                  name="include_carrot_snacks"
                  id="feature-include-carrots"
                  label={label || ''}
                  onChange={this.props.onChangeFeature}
                  value={Boolean(this.props.include_carrot_snacks)}
                />
              )}
            </I18nResource>
          </div>
        </div>
      </>
    )
  }
}

export default withFeatureFlags(['include_carrot_snacks'], App)
