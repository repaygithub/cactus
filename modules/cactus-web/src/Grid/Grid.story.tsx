import React from 'react'

import { Box, Grid } from '../'

export default {
  title: 'Grid',
  component: Grid,
  parameters: { controls: { disable: true } },
} as const

type ColumnNum = React.ComponentProps<typeof Grid.Item>['tiny']
const getItems = (prefix: string, tiny: ColumnNum, medium: ColumnNum, count = 1) => {
  const items = []
  for (let i = 0; i < count; i++) {
    items.push(
      <Grid.Item key={prefix + i} tiny={tiny} medium={medium}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
    )
  }
  return items
}

export const BasicUsage = (): React.ReactElement => (
  <Grid>
    {getItems('00', 3, 1, 12)}
    {getItems('01', 4, 2, 6)}
    {getItems('02', 3, 3, 4)}
    {getItems('03', 4, 4, 3)}

    {getItems('04', 6, 5)}
    {getItems('05', 3, 4)}
    {getItems('06', 3, 3)}

    {getItems('07', 6, 6, 2)}

    {getItems('08', 6, 7)}
    {getItems('09', 3, 3)}
    {getItems('10', 3, 2)}

    {getItems('11', 8, 8)}
    {getItems('12', 4, 4)}

    {getItems('13', 9, 9)}
    {getItems('14', 3, 3)}

    {getItems('15', 9, 10)}
    {getItems('16', 3, 2)}

    {getItems('17', 9, 11)}
    {getItems('18', 3, 1)}

    {getItems('19', 12, 12)}
  </Grid>
)

export const PreventGridBlowout = (): React.ReactElement => {
  const LONG_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut viverra diam sed consequat
  auctor. Cras interdum vel tortor eget consequat. Aliquam id accumsan eros, a condimentum
  neque. Cras nibh leo, pulvinar eu enim at, sodales molestie enim. Cras a lacinia nunc.
  Nunc rutrum ut leo sed elementum.`
  const getTextItem = (key: string, tiny: ColumnNum, medium: ColumnNum) => (
    <Grid.Item key={key} tiny={tiny} medium={medium}>
      <p style={{ overflow: 'hidden', height: 'auto', margin: '0' }}>
        {LONG_TEXT.replace(/\s/g, '')}
      </p>
    </Grid.Item>
  )
  return (
    <Grid>
      {getItems('0', 3, 1, 6)}
      {getTextItem('1', 3, 1)}
      {getItems('2', 3, 1, 5)}

      {getItems('3', 3, 3, 2)}
      {getTextItem('4', 3, 3)}
      {getItems('5', 3, 3)}

      {getItems('6', 10, 9)}
      {getTextItem('7', 2, 3)}

      {getTextItem('8', 9, 4)}
      {getItems('9', 3, 8)}
    </Grid>
  )
}
