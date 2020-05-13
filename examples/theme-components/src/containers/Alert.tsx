import React from 'react'

import { Alert, Flex, Label, Text } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import { Status } from '@repay/cactus-web/src/Alert/Alert'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

const status: Status[] = ['error', 'warning', 'info', 'success']

const AlertComponent: React.FC<RouteComponentProps> = () => {
  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Alert
      </Text>
      <Flex flexDirection="column" alignItems="center" width="100%">
        <Label> General</Label>
        {status.map(e => (
          <Alert status={e} type="general" my="10px" key={e} width="50%">
            <Text textAlign="center">{e} Message</Text>
          </Alert>
        ))}
      </Flex>
    </div>
  )
}

export default AlertComponent
