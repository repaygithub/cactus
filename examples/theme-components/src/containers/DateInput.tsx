import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { DateInput, Flex, Label, SelectField, Text } from '@repay/cactus-web'
import { DateType } from '@repay/cactus-web/src/helpers/dates'
import React, { useState } from 'react'

import Link from '../components/Link'

type ChangeHandler = React.ChangeEventHandler<{ value: Date | string | null | number }>

const DateInputExample: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [type, setType] = useState<DateType>('date')
  const [value, setValue] = useState(new Date())

  const onChange = React.useCallback<ChangeHandler>((e) => setValue(e.target.value as Date), [])

  const changeType = (value: any): void => {
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
          <DateInput
            id="date-input-1 aklhjdklshd"
            name="date-input"
            type={type}
            value={value}
            onChange={onChange}
          />
          <SelectField
            margin="auto"
            label="Select date type"
            options={['date', 'datetime', 'time']}
            name="icons"
            value={type}
            onChange={({ target: { value } }): void => changeType(value)}
            id={Math.random().toString()}
          />
        </Flex>
      </Flex>
    </div>
  )
}
export default DateInputExample
