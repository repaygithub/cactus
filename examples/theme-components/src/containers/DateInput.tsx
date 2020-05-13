import React, { useState } from 'react'

import { DateInput, Flex, Label, SelectField, Text } from '@repay/cactus-web'
import { DateType } from '@repay/cactus-web/src/helpers/dates'
import { RouteComponentProps } from '@reach/router'
import FormHandler from '@repay/cactus-web/src/storySupport/FormHandler'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

const DateInputExample: React.FC<RouteComponentProps> = () => {
  const [type, setType] = useState<DateType>('date')

  const changeType = (value: any) => {
    const typeName: DateType = value
    setType(typeName)
  }
  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        DateInput
      </Text>
      <Flex justifyContent="space-evenly" alignItems="center" width="100%" flexDirection="row">
        <Flex flexDirection="column">
          <Label>Basic </Label>
          <DateInput id="date-input-uncontrolled" name="date" />
        </Flex>
        <Flex flexDirection="column">
          <Label>Controlled with default date </Label>
          <FormHandler
            defaultValue={new Date()}
            onChange={(_, value: string | Date | null) => value}
          >
            {({ value, onChange }) => (
              <DateInput
                id="date-input-1 aklhjdklshd"
                name="date-input"
                type={type}
                value={value}
                onChange={onChange}
              />
            )}
          </FormHandler>
          <SelectField
            margin="auto"
            label="Select date type"
            options={['date', 'datetime', 'time']}
            name="icons"
            value={type}
            onChange={(_, value) => changeType(value)}
            id={Math.random().toString()}
          />
        </Flex>
      </Flex>
    </div>
  )
}
export default DateInputExample
