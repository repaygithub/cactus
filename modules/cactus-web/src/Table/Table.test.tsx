import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Table from './Table'

describe('component: Table', (): void => {
  test('ignores width on card', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <Table variant="card">
          <Table.Header>
            <Table.Cell>Header Cell</Table.Cell>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell width="230px" data-testid="cell">
                Data cell
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </StyleProvider>
    )
    const singleCell = getByTestId('cell')
    expect(singleCell).toHaveStyle('width: 240px')
  })
})
