import React, { ChangeEvent, Component, CSSProperties } from 'react'

import { Box, Flex, ToggleField } from '@repay/cactus-web'
import { I18nResource, I18nText } from '@repay/cactus-i18n'
import { Link, RouteComponentProps } from '@reach/router'
import { withFeatureFlags } from '@repay/cactus-fwk'
import Heart from '@repay/cactus-icons/i/status-like'

type AppProps = {
  onLangChange: (event: ChangeEvent<HTMLSelectElement>) => void
  onChangeFeature: (name: string, enabled: boolean) => void
  lang: string
  include_carrot_snacks?: boolean
  children?: React.ReactNode
}

class App extends Component<RouteComponentProps<AppProps>> {
  render() {
    return (
      <>
        <Flex>
          <select onChange={this.props.onLangChange} value={this.props.lang}>
            <option value="">Use Browser</option>
            <option value="en-US">🇺🇸 English</option>
            <option value="es-MX">🇲🇽 Español</option>
          </select>
          <Link to="/">
            <Heart />
            <I18nText get="home-link" />
          </Link>
        </Flex>
        {this.props.children}
        <Box
          position="fixed"
          bottom="20px"
          right="20px"
          borderWidth="2px"
          borderStyle="solid"
          borderColor="mediumContrast"
          padding={4}
        >
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
        </Box>
      </>
    )
  }
}

export default withFeatureFlags(['include_carrot_snacks'], App)
