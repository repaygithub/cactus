import { RouteComponentProps } from '@reach/router'
import { DateInputField, Flex, SelectField, TextInputField } from '@repay/cactus-web'
import React from 'react'

type InputType = 'date' | 'datetime' | 'time'

const getDefault = (inputType: InputType) => {
  if (inputType === 'date') {
    return '2019-10-16'
  } else if (inputType === 'time') {
    return '23:57'
  }
  return '2019-10-16T01:02'
}

const DateTest: React.FC<RouteComponentProps> = () => {
  const [inputType, setInputType] = React.useState<InputType>('date')
  const [dateVal, setDateVal] = React.useState<string>('2019-10-16')
  const onTypeChange = React.useCallback((e: any) => setInputType(e.target.value), [])
  const onDateChange = React.useCallback((e: any) => setDateVal(e.target.value), [])
  React.useEffect(() => setDateVal(getDefault(inputType)), [inputType])
  return (
    <Flex paddingX="30%" flexDirection="column">
      <SelectField
        label="Date Field Type"
        name="type"
        id="input-type"
        value={inputType}
        onChange={onTypeChange}
        options={['date', 'datetime', 'time']}
      />
      <TextInputField
        label="Unified Value"
        name="value"
        id="unified-value"
        value={dateVal}
        onChange={onDateChange}
      />
      <DateInputField
        label="Date/Time Test Field"
        name="test"
        id="date-test"
        type={inputType}
        value={dateVal}
        onChange={onDateChange}
      />
    </Flex>
  )
}

export default DateTest
