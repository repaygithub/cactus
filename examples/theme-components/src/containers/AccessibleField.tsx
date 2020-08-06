import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { AccessibleField, Box, Button, Flex, Text } from '@repay/cactus-web'
import React, { useState } from 'react'

import Link from '../components/Link'

const AccessibleFieldComponent: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [warning, setWarning] = useState('')

  const cleanState = (): void => {
    setError('')
    setSuccess('')
    setWarning('')
  }

  const checkValidEmail = (): void => {
    cleanState()
    const regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    if (regex.test(value)) {
      if (RegExp(/[A-Z]/).test(value)) {
        setWarning('Warning')
      } else {
        setSuccess('Valid!')
      }
    } else {
      setError('Error')
    }
  }
  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Accessible Field
      </Text>

      <Flex
        justifyContent="flex-start"
        padding={4}
        flexDirection="column"
        alignItems="center"
        height="100vh"
      >
        <Box height="15vh">
          <AccessibleField
            name="name"
            label="Enter Email Adress"
            error={error}
            warning={warning}
            success={success}
            tooltip="Enter Email Adress"
          >
            <input
              style={{ minWidth: '300px' }}
              value={value}
              placeholder="name@example.com"
              onChange={(e): void => setValue(e.target.value)}
            />
          </AccessibleField>
        </Box>

        <Button onClick={checkValidEmail}>Check Email </Button>
        <Text>
          This component allows you to accessibly tie a label, a tooltip, and a status message to an
          <strong>
            <i> input </i>
          </strong>
          field. In this case, you can test if an email is valid, you just have to type it and click
          check email. After that, the corresponing status message will show up. Use this example to
          investigate in the dev tools how the IDs relate to the
          <strong>
            <i> input </i>
          </strong>
          (pay particular attention to the
          <strong>
            <i> aria-describedby </i>
          </strong>
          attribute of the
          <strong>
            <i> input </i>
          </strong>
          ).
        </Text>
      </Flex>
    </div>
  )
}

export default AccessibleFieldComponent
