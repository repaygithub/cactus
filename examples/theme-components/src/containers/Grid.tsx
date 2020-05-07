import React, { useCallback, useState } from 'react'

import { Box, Flex, Grid, SelectField, Text } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

const columns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

const initialState = {
  red: '4',
  green: '4',
  blue: '4',
  black: '4',
}
const GridExample: React.FC<RouteComponentProps> = () => {
  const [state, setStatte] = useState(initialState)

  const changeState = useCallback(
    (name, value) => {
      setStatte({ ...state, [name]: value })
    },
    [state]
  )
  return (
    <Flex flexDirection="column" height="100%">
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Grid Layout
      </Text>
      <Grid>
        <Grid.Item tiny={parseInt(state.red)}>
          <Box width="100%" height="25px" backgroundColor="red" />
        </Grid.Item>
        <Grid.Item tiny={parseInt(state.green)}>
          <Box width="100%" height="25px" backgroundColor="green" />
        </Grid.Item>
        <Grid.Item tiny={parseInt(state.blue)} m>
          <Box width="100%" height="25px" backgroundColor="blue" />
        </Grid.Item>
        <Grid.Item tiny={parseInt(state.black)}>
          <Box width="100%" height="25px" backgroundColor="black" />
        </Grid.Item>
      </Grid>
      <Flex width="50%" margin="auto" justifyContent="space-between" alignItems="flex-end">
        <SelectField
          options={columns}
          label="Red block Columns"
          name="red"
          onChange={changeState}
        />
        <SelectField
          options={columns}
          label="Green block Columns"
          name="green"
          onChange={changeState}
        />
        <SelectField
          options={columns}
          label="Blue block Columns"
          name="blue"
          onChange={changeState}
        />
        <SelectField
          options={columns}
          label="Black block Columns"
          name="black"
          onChange={changeState}
        />
      </Flex>
    </Flex>
  )
}
export default GridExample
