import React from 'react'

import { DescriptiveEnvelope } from '@repay/cactus-icons'
import { storiesOf } from '@storybook/react'
import Table from './Table'

storiesOf('Table', module).add('Header', () => (
  <Table>
    <Table.Header>
      <Table.Cell cellType="th" align="center">
        Header
      </Table.Cell>
      <Table.Cell cellType="th" align="center">
        Header
      </Table.Cell>
      <Table.Cell cellType="th" align="center">
        Header
      </Table.Cell>
    </Table.Header>
  </Table>
))

const arr = [1, 2, 3, 4, 5, 6, 7]

const amount = [
  '$ 123.00',
  '$ 123.00',
  '$ 123.00',
  '$ 123.00',
  '$ 123.000.00',
  '$ 23.00',
  '$ 3000.00',
  '$ 123.231.00',
]

storiesOf('Table', module).add('Row', () => (
  <Table>
    <Table.Body>
      <Table.Row>
        <>
          {arr.map((e, i) => (
            <Table.Cell cellType="td" align="left" key={i}>
              Cell {e}
            </Table.Cell>
          ))}
          <Table.Cell cellType="td" align="center">
            Label
            <DescriptiveEnvelope />
          </Table.Cell>
        </>
      </Table.Row>
      <Table.Row>
        {amount.map((e, i) => (
          <Table.Cell cellType="td" align="right" key={i}>
            {e}
          </Table.Cell>
        ))}
      </Table.Row>
      <Table.Row>
        <>
          <Table.Cell cellType="td" align="center">
            <DescriptiveEnvelope />
          </Table.Cell>
          {arr.map((e, i) => (
            <Table.Cell cellType="td" align="left" key={i}>
              Cell {e}
            </Table.Cell>
          ))}
        </>
      </Table.Row>
    </Table.Body>
  </Table>
))
