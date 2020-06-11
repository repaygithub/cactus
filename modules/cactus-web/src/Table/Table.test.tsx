import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Table from './Table'

afterEach(cleanup)

describe('component: Table', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Table>
          <Table.Header>
            <Table.Cell>Header Cell</Table.Cell>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
