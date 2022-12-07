import React from 'react'

import { Table } from '../'
import { HIDE_CONTROL, SPACE, Story, STRING } from '../helpers/storybook'

export default {
  title: 'Table',
  component: Table,
  argTypes: {
    width: STRING,
    minWidth: STRING,
    maxWidth: STRING,
    dividers: { control: 'boolean' },
  },
} as const

type TableStory = Story<
  typeof Table,
  {
    captionText: string
    hasHeader: boolean
    headerText: string
    cellText: string
    columnCount: number
    rowCount: number
    alignment: 'left' | 'right' | 'center'
    hasBody: boolean
  }
>

export const Layout: TableStory = ({
  captionText,
  hasHeader = true,
  headerText,
  cellText,
  columnCount,
  rowCount,
  alignment,
  hasBody = true,
  ...args
}) => {
  const makeRow = (
    content: string,
    index: number,
    Row: React.ElementType = Table.Row
  ): React.ReactElement => {
    const cols = []
    for (let i = 0; i < columnCount; i++) {
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
    <Table {...args}>
      {captionText && <caption>{captionText}</caption>}
      {header}
      <Body>{rows}</Body>
    </Table>
  )
}
Layout.argTypes = {
  alignment: { name: 'cell align', options: ['left', 'center', 'right'] },
  captionText: STRING,
  hasHeader: { name: 'has thead' },
  hasBody: { name: 'has tbody' },
  margin: SPACE,
  sticky: { name: 'Sticky column position', options: ['right', 'none'] },
  rowFocus: { options: [true, false, 'mouse-only'] },
  variant: { control: 'object', options: null },
}
Layout.args = {
  captionText: '',
  hasHeader: true,
  headerText: 'Header',
  cellText: 'Cell',
  columnCount: 4,
  rowCount: 3,
  hasBody: true,
  sticky: 'none',
  rowFocus: true,
  rowHover: true,
  variant: { tiny: 'card', small: 'mini', medium: 'table' },
}

export const StylesOnly: TableStory = ({
  captionText,
  hasHeader,
  headerText,
  cellText,
  columnCount,
  rowCount,
  alignment,
  hasBody,
  ...args
}) => {
  const makeRow = (
    content: string,
    index: number,
    Cell: React.ElementType = 'td'
  ): React.ReactElement => {
    const cols = []
    for (let i = 0; i < columnCount; i++) {
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
    <Table {...args}>
      {captionText && <caption>{captionText}</caption>}
      {header}
      <Body>{rows}</Body>
    </Table>
  )
}
StylesOnly.argTypes = {
  ...Layout.argTypes,
  variant: { options: ['table', 'card', 'mini'] },
}

delete StylesOnly.argTypes.alignment
StylesOnly.args = { ...Layout.args, noScrollWrapper: true }

export const WithLongValues: Story<
  typeof Table,
  {
    text1: string
    text2: string
  }
> = ({ text1, text2 }) => {
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
          <Table.Cell>{text1}</Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
          <Table.Cell>Data cell</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Data cell</Table.Cell>
          <Table.Cell>{text2}</Table.Cell>
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
WithLongValues.argTypes = {
  variant: HIDE_CONTROL,
  dividers: HIDE_CONTROL,
}
const text =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta perspiciatis dolores autem reiciendis minus voluptates, necessitatibus expedita inventore id vel'
WithLongValues.args = {
  text1: text,
  text2: text,
}
WithLongValues.storyName = 'With long values'
