import { RouteComponentProps } from '@reach/router'
import { I18nSection, I18nText } from '@repay/cactus-i18n'
import { Box, SelectField } from '@repay/cactus-web'
import React from 'react'

const Coffee: React.FC<RouteComponentProps> = (): React.ReactElement => {
  return (
    <I18nSection name="coffee">
      <h2>
        <I18nText get="welcome-message" />
      </h2>
      <div>
        <I18nText get="description" />
      </div>
      <Box maxWidth="500px" as={SelectField} name="likes" label={<I18nText get="likes" />}>
        <option value="coffee">
          <I18nText get="coffee" />
        </option>
        <option value="caffeine">
          <I18nText get="caffeine" />
        </option>
        <option value="brew">
          <I18nText get="brew" />
        </option>
        <option value="ink">
          <I18nText get="ink" />
        </option>
        <option value="battery acid">
          <I18nText get="battery-acid" />
        </option>
        <option value="joe">
          <I18nText get="joe" />
        </option>
      </Box>
    </I18nSection>
  )
}

export default Coffee
