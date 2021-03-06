import { Link, RouteComponentProps } from '@reach/router'
import { withFeatureFlags } from '@repay/cactus-fwk'
import { I18nResource, I18nText } from '@repay/cactus-i18n'
import Heart from '@repay/cactus-icons/i/status-like'
import { Box, Flex, MenuButton, ToggleField } from '@repay/cactus-web'
import React, { Component, ReactElement } from 'react'

interface AppProps extends RouteComponentProps {
  onLangChange: (lang: string) => void
  onChangeFeature: (event: React.ChangeEvent<HTMLInputElement>) => void
  lang: string
  include_carrot_snacks?: boolean
  children?: React.ReactNode
}

class App extends Component<AppProps> {
  public render(): ReactElement {
    return (
      <div style={{ paddingTop: '8px' }}>
        <Flex>
          <I18nResource get="language-label">
            {(label): ReactElement => (
              <MenuButton label={label} ml={2} mr={2} data-testid="select-language">
                <MenuButton.Item onSelect={(): void => this.props.onLangChange('en-US')}>
                  🇺🇸 English
                </MenuButton.Item>
                <MenuButton.Item
                  onSelect={(): void => this.props.onLangChange('es-US')}
                  data-testid="spanish-option"
                >
                  🇲🇽 Español
                </MenuButton.Item>
              </MenuButton>
            )}
          </I18nResource>
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
              {(label): ReactElement => (
                <ToggleField
                  name="include_carrot_snacks"
                  id="feature-include-carrots"
                  label={label || ''}
                  onChange={this.props.onChangeFeature}
                  checked={Boolean(this.props.include_carrot_snacks)}
                />
              )}
            </I18nResource>
          </div>
        </Box>
      </div>
    )
  }
}

export default withFeatureFlags(['include_carrot_snacks'], App)
