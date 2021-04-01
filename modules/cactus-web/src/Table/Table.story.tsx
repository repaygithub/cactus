import { boolean, number, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Table } from '../'

type CellAlignment = 'left' | 'right' | 'center'
const alignOptions = {
  left: 'left',
  right: 'right',
  center: 'center',
  undefined: '',
}

type Variant = 'table' | 'card'
const varOptions = {
  undefined: '',
  table: 'table',
  card: 'card',
}

const createAlignKnob = (): CellAlignment =>
  select('align (prop on Table.Cell)', alignOptions, 'left') as CellAlignment

export default {
  title: 'Table',
  component: Table,
} as Meta

export const Layout = (): React.ReactElement => {
  const fullWidth = boolean('fullWidth', true)
  const captionText = text('Caption', '')
  const hasHeader = boolean('Has Header', true)
  const headerText = text('Header Text', 'Header')
  const cellText = text('Cell Text', 'Cell')
  const colCount = number('# Columns', 4)
  const rowCount = number('# Rows', 3)
  const alignment = createAlignKnob()
  const hasBody = boolean('Has tbody', true)
  const variant = select('Variant Override', varOptions, undefined) as Variant

  const makeRow = (
    content: string,
    index: number,
    Row: React.ElementType = Table.Row
  ): React.ReactElement => {
    const cols = []
    for (let i = 0; i < colCount; i++) {
      cols.push(
        <Table.Cell align={alignment} key={i}>
          {content ? `${content} ${i}` : null}
        </Table.Cell>
      )
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
    <Table fullWidth={fullWidth} variant={variant} dividers={boolean('dividers', false)}>
      {captionText && <caption>{captionText}</caption>}
      {header}
      <Body>{rows}</Body>
    </Table>
  )
}

export const StylesOnly = (): React.ReactElement => {
  const fullWidth = boolean('fullWidth', true)
  const captionText = text('Caption', '')
  const hasHeader = boolean('Has Header', true)
  const headerText = text('Header Text', 'Header')
  const cellText = text('Cell Text', 'Cell')
  const colCount = number('# Columns', 4)
  const rowCount = number('# Rows', 3)
  const hasBody = boolean('Has tbody', true)

  const makeRow = (
    content: string,
    index: number,
    Cell: React.ElementType = 'td'
  ): React.ReactElement => {
    const cols = []
    for (let i = 0; i < colCount; i++) {
      cols.push(<Cell key={i}>{`${content} ${i}`}</Cell>)
    }
    return <tr key={index}>{cols}</tr>
  }

  const header = hasHeader ? <thead>{makeRow(headerText, 0, 'th')}</thead> : null
  const Body = hasBody ? 'tbody' : React.Fragment
  const rows = []
  for (let i = 0; i < rowCount; i++) {
    rows.push(makeRow(cellText, i + 1))
  }

  return (
    <Table as="table" fullWidth={fullWidth}>
      {captionText && <caption>{captionText}</caption>}
      {header}
      <Body>{rows}</Body>
    </Table>
  )
}

export const WithLongValues = (): React.ReactElement => {
  return (
    <Table variant="card">
      <Table.Header>
        <Table.Cell>Header Cell</Table.Cell>
        <Table.Cell>Header Cell</Table.Cell>
        <Table.Cell>Header Cell</Table.Cell>
        <Table.Cell>Header Cell</Table.Cell>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            {text(
              'text 1',
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta perspiciatis dolores autem reiciendis minus voluptates, necessitatibus expedita inventore id vel'
            )}
          </Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Data cell</Table.Cell>
          <Table.Cell>
            {text(
              'text 2',
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta perspiciatis dolores autem reiciendis minus voluptates, necessitatibus expedita inventore id vel'
            )}
          </Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Data cell</Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Data cell</Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}

WithLongValues.storyName = 'With long values'
