import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { Flex, SelectField, Text } from '@repay/cactus-web'
import { Property } from 'csstype'
import React, { useCallback, useState } from 'react'

import Link from '../components/Link'

const justifyOptions = [
  'normal',
  'unset',
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
]

const alignOptions = ['flex-end', 'flex-start', 'center', 'stretch']

const directionOptions = ['unset', 'row', 'row-reverse', 'column', 'column-reverse']

const flexWrapOptions = ['unset', 'initial', 'wrap', 'nowrap', 'wrap-reverse']
const colors = [
  'base',
  'darkestContrast',
  'callToAction',
  'base',
  'error',
  'darkestContrast',
  'lightContrast',
  'success',
  'warning',
]

const initialState = {
  justifyOptions: '',
  alignOptions: '',
  directionOptions: '',
  flexWrapOptions: '',
  items: 9,
}

const FlexExample: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [state, setState] = useState(initialState)

  const changeProps = useCallback(
    (name, value): void => {
      if (name === 'items') {
        value = parseInt(value.replace(/\D/g, ''), 10)
      }
      setState({ ...state, [name]: value })
    },
    [state]
  )

  return (
    <div style={{ height: '100%' }}>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Flex layout
      </Text>
      <Flex
        width="60%"
        height="60%"
        margin="auto"
        border="1px solid red"
        justifyContent={state.justifyOptions}
        alignItems={state.alignOptions}
        flexWrap={state.flexWrapOptions as Property.FlexWrap}
        flexDirection={state.directionOptions as Property.FlexDirection}
      >
        {[...Array(state.items > 0 ? state.items : 2)].map(
          (_, i): React.ReactElement => (
            <Flex p={5} colors={colors[i]} height="100px" width="100px" key={i} />
          )
        )}
      </Flex>
      <Flex alignItems="flex-end" justifyContent="space-evenly" height="20%">
        <SelectField
          options={justifyOptions}
          label="Justify content"
          name="justifyOptions"
          onChange={changeProps}
        />
        <SelectField
          options={alignOptions}
          label="Align Items"
          name="alignOptions"
          onChange={changeProps}
        />
        <SelectField
          options={directionOptions}
          label="Flex Firection"
          name="directionOptions"
          onChange={changeProps}
        />
        <SelectField
          options={flexWrapOptions}
          label="Flex Wrap"
          name="flexWrapOptions"
          onChange={changeProps}
        />
        <SelectField
          options={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
          value={state.items.toString()}
          name="items"
          onChange={changeProps}
          label="Number of items"
        />
      </Flex>
    </div>
  )
}
export default FlexExample
