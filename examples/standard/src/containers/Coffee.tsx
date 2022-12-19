import { RouteComponentProps } from '@reach/router'
import { I18nSection, I18nText } from '@repay/cactus-i18n'
import React from 'react'

const Coffee: React.FC<RouteComponentProps> = (): React.ReactElement => {
  return (
    <I18nSection section="coffee">
      <h2>
        <I18nText get="welcome-message" />
      </h2>
      <div>
        <I18nText get="description" />
      </div>
    </I18nSection>
  )
}

export default Coffee
