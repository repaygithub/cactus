import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { Box, Flex, Grid, SelectField, Text } from '@repay/cactus-web'
import React, { useCallback, useState } from 'react'

import Link from '../components/Link'

type ColumnNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

const columns: ColumnNum[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const initialState = {
  red: 4 as ColumnNum,
  green: 4 as ColumnNum,
  blue: 4 as ColumnNum,
  black: 4 as ColumnNum,
}
const GridExample: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const [state, setState] = useState(initialState)

  const changeState = useCallback(
    ({ target: { name, value } }): void => {
      setState({ ...state, [name]: value as ColumnNum })
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
        <Grid.Item tiny={state.red}>
          <Box width="100%" height="25px" backgroundColor="red" />
        </Grid.Item>
        <Grid.Item tiny={state.green}>
          <Box width="100%" height="25px" backgroundColor="green" />
        </Grid.Item>
        <Grid.Item tiny={state.blue}>
          <Box width="100%" height="25px" backgroundColor="blue" />
        </Grid.Item>
        <Grid.Item tiny={state.black}>
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
