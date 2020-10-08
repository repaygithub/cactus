import { boolean, number, select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import ScreenSizeProvider from '../ScreenSizeProvider/ScreenSizeProvider'
import Table from './Table'

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

const tableStories = storiesOf('Table', module)

tableStories.add(
  'Layout',
  (): React.ReactElement => {
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
      <ScreenSizeProvider>
        <Table fullWidth={fullWidth} variant={variant}>
          {captionText && <caption>{captionText}</caption>}
          {header}
          <Body>{rows}</Body>
        </Table>
      </ScreenSizeProvider>
    )
  }
)

tableStories.add(
  'Styles Only',
  (): React.ReactElement => {
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
      <ScreenSizeProvider>
        <Table as="table" fullWidth={fullWidth}>
          {captionText && <caption>{captionText}</caption>}
          {header}
          <Body>{rows}</Body>
        </Table>
      </ScreenSizeProvider>
    )
  }
)
tableStories.add(
  'With long values',
  (): React.ReactElement => {
    return (
      <ScreenSizeProvider>
        <Table variant="card">
          <Table.Header>
            <Table.Cell>Header Cell</Table.Cell>
            <Table.Cell>Header Cell</Table.Cell>
            <Table.Cell>Header Cell</Table.Cell>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
              <Table.Cell>Data cell</Table.Cell>
              <Table.Cell>Data cell</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
              <Table.Cell>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta perspiciatis
                dolores autem reiciendis minus voluptates, necessitatibus expedita inventore id vel
              </Table.Cell>
              <Table.Cell>Data cell</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
              <Table.Cell>Data cell</Table.Cell>
              <Table.Cell>Data cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </ScreenSizeProvider>
    )
  }
)
