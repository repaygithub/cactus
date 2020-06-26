import React from 'react'

import { boolean, number, select, text } from '@storybook/addon-knobs'
import { DefaultTheme, StyledComponent } from 'styled-components'
import { storiesOf } from '@storybook/react'
import Table from './Table'

type CellAlignment = 'left' | 'right' | 'center'
const alignOptions = {
  left: 'left',
  right: 'right',
  center: 'center',
  undefined: '',
}

const createAlignKnob = () =>
  select('align (prop on Table.Cell)', alignOptions, 'left') as CellAlignment

storiesOf('Table', module).add('Layout', () => {
  const fullWidth = boolean('fullWidth', true)
  const captionText = text('Caption', '')
  const hasHeader = boolean('Has Header', true)
  const headerText = text('Header Text', 'Header')
  const cellText = text('Cell Text', 'Cell')
  const colCount = number('# Columns', 4)
  const rowCount = number('# Rows', 3)
  const alignment = createAlignKnob()
  const hasBody = boolean('Has tbody', true)

  const makeRow = (
    content: string,
    index: number,
    Row: StyledComponent<any, DefaultTheme, {}, never> = Table.Row
  ) => {
    const cols = []
    for (let i = 0; i < colCount; i++) {
      cols.push(<Table.Cell align={alignment} key={i}>{`${content} ${i}`}</Table.Cell>)
    }
    return <Row key={index}>{cols}</Row>
  }

  const header = hasHeader ? makeRow(headerText, 0, Table.Header) : null
  const Body = hasBody ? Table.Body : React.Fragment
  const rows = []
  for (let i = 0; i < rowCount; i++) {
    rows.push(makeRow(cellText, i + 1))
  }

  return (
    <Table fullWidth={fullWidth}>
      {captionText && <caption>{captionText}</caption>}
      {header}
      <Body>{rows}</Body>
    </Table>
  )
})
