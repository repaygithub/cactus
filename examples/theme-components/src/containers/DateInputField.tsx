import React from 'react'

import { DateInputField, Flex, Text } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

function initValues() {
  return {
    date_field: '',
    isValid: false,
  }
}

const DateInputFieldExample: React.FC<RouteComponentProps> = () => {
  const [values, setValues] = React.useState(initValues)
  const handleChange = React.useCallback((name, value) => {
    if (new Date() < new Date(value)) {
      setValues((v) => ({ ...v, isValid: true }))
    } else {
      setValues((v) => ({ ...v, isValid: false }))
    }
    setValues((v) => ({ ...v, [name]: value }))
  }, [])

  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        DateInputField
      </Text>
      <Flex width="100%" justifyContent="center">
        <form onSubmit={(event) => event.preventDefault()}>
          <DateInputField
            name="date_field"
            label="Date Field"
            success={values.isValid ? 'Valid date ' : undefined}
            error={values.isValid ? undefined : 'Date should be after today'}
            value={values.date_field}
            onChange={handleChange}
          />
        </form>
      </Flex>
    </div>
  )
}

export default DateInputFieldExample
