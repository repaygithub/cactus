import { Link, RouteComponentProps } from '@reach/router'
import { I18nSection, I18nText } from '@repay/cactus-i18n'
import { Box, SelectField, Text } from '@repay/cactus-web'
import React, { useState } from 'react'

import { supportedLanguages } from '../i18nController'

const languageOptions = [
  { value: '', label: 'use default' },
  ...supportedLanguages.map((l): { value: string; label: string } => ({
    value: l.code,
    label: l.label,
  })),
]

const Home: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [termsLang, setTermsLang] = useState<string | undefined>()
  return (
    <div className="App">
      <h2 className="App-header">
        <I18nText get="welcome-message" />
      </h2>
      <div>
        <I18nSection name="coffee">
          <Link to="coffee">
            <I18nText get="link-message" />
          </Link>
        </I18nSection>
      </div>
      <div>
        <I18nSection name="snacks">
          <Link to="snacks">
            <I18nText get="link-message" />
          </Link>
        </I18nSection>
      </div>
      <Box maxWidth="600px" mx="auto" my={4}>
        <Text as="h3">
          <I18nText get="terms-title" />
        </Text>
        <Box maxWidth="300px">
          <SelectField
            label="Language"
            name="termsLang"
            value={termsLang}
            onChange={(_, value: any): void => setTermsLang(value as string)}
            options={languageOptions}
          />
        </Box>
        <I18nSection name="terms" lang={termsLang}>
          <Box as="p" py={3}>
            <I18nText get="terms-and-conditions" />
          </Box>
        </I18nSection>
      </Box>
    </div>
  )
}

export default Home
