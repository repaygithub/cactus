import React from 'react'

import { Box, Grid } from '../'
import { SPACE, Story, STRING } from '../helpers/storybook'

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

const DEFAULTS = [
  { row: '1 / span 2', col: '2 / 5', minHeight: '250px', backgroundColor: 'lightContrast' },
  { row: '1', col: '1', backgroundColor: 'base' },
  { row: '2 / 4', col: '1', backgroundColor: 'red' },
  { row: '3', col: '3 / 5', backgroundColor: 'green' },
]

const GridItem: React.FC<{ index: number }> = ({ index }) => {
  const [state, setState] = React.useState<string>(() => {
    const init = DEFAULTS[index] || {
      backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 30%, 70%)`,
    }
    return JSON.stringify(init, null, 2)
  })
  const last = React.useRef<any>({})
  try {
    last.current = { ...JSON.parse(state) }
  } catch {}
  const props = last.current
  return (
    <Box as={Grid.Item} padding={5} minHeight="150px" {...props}>
      <Box
        as="textarea"
        minHeight="100%"
        minWidth="100%"
        value={state}
        onChange={(e: any) => setState(e.target.value)}
      />
    </Box>
  )
}

export const ActualGrid: Story<typeof Grid, { itemCount: number }> = (args) => {
  const { itemCount, ...props } = args
  mayHaveParens.forEach((prop) => {
    if (props[prop]) {
      props[prop] = addParens(props[prop])
    }
  })
  const items: React.ReactChild[] = (props.children = [])
  for (let i = 0; i < itemCount; i++) {
    items.push(<GridItem key={i} index={i} />)
  }
  return <Grid {...props} />
}
ActualGrid.args = { rows: '3', cols: '4', itemCount: 4 }
const mapInt = (str: string | undefined) => {
  if (str && /^\d+$/.test(str)) return parseInt(str)
  return str
}
ActualGrid.argTypes = {
  gap: SPACE,
  width: STRING,
  rows: { ...STRING, map: mapInt },
  cols: { ...STRING, map: mapInt },
  justifyItems: STRING,
  justifyContent: STRING,
  alignItems: STRING,
  alignContent: STRING,
  autoFlow: STRING,
  autoRows: STRING,
  autoColumns: STRING,
  gridAreas: { control: 'object' },
  itemCount: { control: 'number' },
}
ActualGrid.parameters = { controls: { disable: false, include: Object.keys(ActualGrid.argTypes) } }

// This is pretty weird, an unclosed paren can apparently break the entire stylesheet.
const mayHaveParens = ['rows', 'cols', 'autoRows', 'autoColumns'] as const
const addParens = (str: any) => {
  if (typeof str === 'string') {
    let counter = 0
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '(') counter++
      else if (str[i] === ')') counter = Math.max(0, counter - 1)
    }
    while (counter-- > 0) str += ')'
  }
  return str
}
