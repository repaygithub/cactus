import { Box, Flex, IconButton, StyleProvider, Text } from '@repay/cactus-web'
import { DescriptiveHome } from '@repay/cactus-icons'
import { Helmet } from 'react-helmet'
import { RouteComponentProps, Router } from '@reach/router'
import Accounts from './containers/accounts'
import Faq from './containers/faq'
import Home from './containers/home'
import Link from './components/Link'
import PaymentHistoryReport from './containers/payment-history-report'
import React from 'react'
import ReactDOM from 'react-dom'
import UIConfig from './containers/ui-config'

const appRoot = document.createElement('div')
appRoot.className = 'app-root'
document.body.appendChild(appRoot)

interface ContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    RouteComponentProps {}

const AppContainer = (props: ContainerProps) => {
  const { children } = props

  return (
    <div>
      <StyleProvider global>
        <div>
          <Flex
            alignItems="center"
            justifyContent="space-evenly"
            height="100px"
            width="100%"
            backgroundColor="lightContrast"
          >
            <Link to="/" style={{ fontSize: '30px' }}>
              <Text>
                <DescriptiveHome />
              </Text>
            </Link>
            <Link to="/payment-history" style={{ fontSize: '30px' }}>
              Payment History Report
            </Link>
            <Link to="/accounts" style={{ fontSize: '30px' }}>
              Accounts
            </Link>
            <Link to="/ui-config" style={{ fontSize: '30px' }}>
              UI Config
            </Link>
            <Link to="/faq" style={{ fontSize: '30px' }}>
              FAQ
            </Link>
          </Flex>

          {children}
        </div>
      </StyleProvider>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <Helmet>
        <title> Home </title>
        <link rel="icon" type="image/png" sizes="16x16" href="src/assets/favicon.ico" />
      </Helmet>
      <Router>
        <AppContainer path="/">
          <Home path="/" />
          <PaymentHistoryReport path="/payment-history" />
          <Accounts path="/accounts" />
          <UIConfig path="/ui-config" />
          <Faq path="/faq" />
        </AppContainer>
      </Router>
    </div>
  )
}

ReactDOM.render(<App />, appRoot)
