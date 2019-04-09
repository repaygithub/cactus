import React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import { I18nSection, I18nText } from '@repay/cactus-i18n'

const Home: React.FC<RouteComponentProps> = () => (
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
  </div>
)

export default Home
