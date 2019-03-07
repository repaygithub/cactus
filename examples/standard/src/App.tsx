import React, { Component } from 'react'
import { I18nText, I18nSection } from '@repay/cactus-fwk'
import { Link, RouteComponentProps } from '@reach/router'

class App extends Component<RouteComponentProps> {
  render() {
    return (
      <div className="App">
        <h2 className="App-header">
          <p>
            <I18nText get="welcome-message" />
          </p>
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
  }
}

export default App
