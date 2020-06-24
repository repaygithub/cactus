import React from 'react'

import { DescriptiveEnvelope } from '@repay/cactus-icons'
import { storiesOf } from '@storybook/react'
import Table from './Table'
import { boolean, select } from '@storybook/addon-knobs'

type CellAlignment = 'left' | 'right' | 'center'
const alignOptions = {
  left: 'left',
  right: 'right',
  center: 'center',
  undefined: '',
}

const createAlignKnob = () => select('align (prop on Table.Cell)', alignOptions, 'left') as CellAlignment

storiesOf('Table', module).add('Header', () => (
  <Table fullWidth={boolean('fullWidth', true)}>
    <Table.Header>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
    </Table.Header>
  </Table>
))

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const amount = [
  '$ 123.00',
  '$ 123.00',
  '$ 123.00',
  '$ 123.00',
  '$ 123.000.00',
  '$ 23.00',
  '$ 3000.00',
  '$ 123.231.00',
  '$ 123.00',
  '$ 123.00',
]

storiesOf('Table', module).add('Row', () => (
  <Table fullWidth={boolean('fullWidth', true)}>
    <Table.Body>
      <Table.Row>
        <>
          {arr.map((e, i) => (
            <Table.Cell align={createAlignKnob()} key={i}>
              Cell {e}
            </Table.Cell>
          ))}
          <Table.Cell align={createAlignKnob()}>
            Label
            <DescriptiveEnvelope />
          </Table.Cell>
        </>
      </Table.Row>
      <Table.Row>
        {amount.map((e, i) => (
          <Table.Cell align={createAlignKnob()} key={i}>
            {e}
          </Table.Cell>
        ))}
      </Table.Row>
      <Table.Row>
        <>
          <Table.Cell align={createAlignKnob()}>
            <DescriptiveEnvelope />
          </Table.Cell>
          {arr.map((e, i) => (
            <Table.Cell align={createAlignKnob()} key={i}>
              Cell {e}
            </Table.Cell>
          ))}
        </>
      </Table.Row>
    </Table.Body>
  </Table>
))

storiesOf('Table', module).add('Row and header', () => (
  <Table fullWidth={boolean('fullWidth', true)}>
    <Table.Header>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
      <Table.Cell align={createAlignKnob()}>Header</Table.Cell>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <>
          {arr.map((e, i) => (
            <Table.Cell align={createAlignKnob()} key={i}>
              Cell {e}
            </Table.Cell>
          ))}
          <Table.Cell align={createAlignKnob()}>
            Label
            <DescriptiveEnvelope />
          </Table.Cell>
        </>
      </Table.Row>
      <Table.Row>
        {amount.map((e, i) => (
          <Table.Cell align={createAlignKnob()} key={i}>
            {e}
          </Table.Cell>
        ))}
      </Table.Row>
      <Table.Row>
        <>
          <Table.Cell align={createAlignKnob()}>
            <DescriptiveEnvelope />
          </Table.Cell>
          {arr.map((e, i) => (
            <Table.Cell align={createAlignKnob()} key={i}>
              Cell {e}
            </Table.Cell>
          ))}
        </>
      </Table.Row>
    </Table.Body>
  </Table>
))

storiesOf('Table', module).add('2-cell table', () => (
  <Table fullWidth={boolean('fullWidth', true)}>
    <Table.Header>
      <Table.Cell>Header</Table.Cell>
      <Table.Cell>Header</Table.Cell>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>
          Foo
        </Table.Cell>
        <Table.Cell>
          Bar
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Fizz
        </Table.Cell>
        <Table.Cell>
          Buzz
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
))

storiesOf('Table', module).add('4-cell table', () => (
  <Table fullWidth={boolean('fullWidth', true)}>
    <Table.Header>
      <Table.Cell>Header</Table.Cell>
      <Table.Cell>Header</Table.Cell>
      <Table.Cell>Header</Table.Cell>
      <Table.Cell>Header</Table.Cell>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>
          One
        </Table.Cell>
        <Table.Cell>
          Two
        </Table.Cell>
        <Table.Cell>
          Three
        </Table.Cell>
        <Table.Cell>
          Four
        </Table.Cell>
      </Table.Row>
      <Table.Row>
      <Table.Cell>
          Five
        </Table.Cell>
        <Table.Cell>
          Six
        </Table.Cell>
        <Table.Cell>
          Seven
        </Table.Cell>
        <Table.Cell>
          Eight
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
))
