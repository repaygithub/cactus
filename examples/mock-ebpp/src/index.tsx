import { Router } from '@reach/router'
import { ScreenSizeProvider, StyleProvider } from '@repay/cactus-web'
import React from 'react'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'

import MenuBar from './components/MenuBar'
import Account from './containers/account'
import Accounts from './containers/accounts'
import Faq from './containers/faq'
import Home from './containers/home'
import PaymentHistoryReport from './containers/payment-history-report'
import Rules from './containers/rules'
import UIConfig from './containers/ui-config'

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
document.body.appendChild(appRoot)

const App = (): React.ReactElement => {
  return (
    <StyleProvider global>
      <ScreenSizeProvider>
        <Helmet>
          <title> Home </title>
          <link rel="icon" type="image/png" sizes="16x16" href="src/assets/favicon.ico" />
        </Helmet>
        <Router>
          <MenuBar path="/">
            <Home path="/" />
            <PaymentHistoryReport path="/payment-history" />
            <Accounts path="/accounts" />
            <UIConfig path="/ui-config" />
            <Faq path="/faq" />
            <Rules path="/rules" />
            <Account path="/account/:accountId" />
          </MenuBar>
        </Router>
      </ScreenSizeProvider>
    </StyleProvider>
  )
}

ReactDOM.render(<App />, appRoot)
