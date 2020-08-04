import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { DateInputField, Flex, Text } from '@repay/cactus-web'
import React from 'react'

import Link from '../components/Link'

interface Values {
  dateField: string
  isValid: boolean
}

function initValues(): Values {
  return {
    dateField: '',
    isValid: false,
  }
}

const DateInputFieldExample: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [values, setValues] = React.useState(initValues)
  const handleChange = React.useCallback((name, value): void => {
    if (new Date() < new Date(value)) {
      setValues((v): Values => ({ ...v, isValid: true }))
    } else {
      setValues((v): Values => ({ ...v, isValid: false }))
    }
    setValues((v): Values => ({ ...v, [name]: value }))
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
        <form onSubmit={(event): void => event.preventDefault()}>
          <DateInputField
            name="dateField"
            label="Date Field"
            success={values.isValid ? 'Valid date ' : undefined}
            error={values.isValid ? undefined : 'Date should be after today'}
            value={values.dateField}
            onChange={handleChange}
          />
        </form>
      </Flex>
    </div>
  )
}

export default DateInputFieldExample
