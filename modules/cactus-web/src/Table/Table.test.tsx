import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Table from './Table'

describe('component: Table', () => {
  test('ignores width on card', () => {
    const { getByTestId } = renderWithTheme(
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
    )
    const singleCell = getByTestId('cell')
    expect(singleCell).toHaveStyle('width: 240px')
  })

  test('renders mini table styles', () => {
    const { getByTestId } = renderWithTheme(
      <Table variant="mini">
        <Table.Header>
          <Table.Cell data-testid="header-cell">Header Cell</Table.Cell>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell data-testid="data-cell">Data cell</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Data cell</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Data cell</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
    const headerCell = getByTestId('header-cell')
    const dataCell = getByTestId('data-cell')
    expect(headerCell).toHaveStyle('padding: 8px')
    expect(dataCell).toHaveStyle('padding: 8px')
  })

  test('supports margin space props', () => {
    const { getByTitle } = renderWithTheme(
      <Table title="Table Title" marginTop={2} mb="100px" mx={7}>
        <Table.Header>
          <Table.Cell>Header Cell</Table.Cell>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Data cell</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )

    const tableWrapper = getByTitle('Table Title').parentElement
    expect(tableWrapper).toHaveStyle('margin-top: 4px')
    expect(tableWrapper).toHaveStyle('margin-bottom: 100px')
    expect(tableWrapper).toHaveStyle('margin-left: 40px')
    expect(tableWrapper).toHaveStyle('margin-right: 40px')
  })

  test('Sticky column right', () => {
    const { getAllByTestId } = renderWithTheme(
      <Table sticky="right">
        <Table.Header>
          <Table.Cell>Header Cell</Table.Cell>
          <Table.Cell>Header Cell</Table.Cell>
          <Table.Cell>Header Cell</Table.Cell>
          <Table.Cell data-testid="sticky">Sticky cell 1</Table.Cell>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Data cell</Table.Cell>
            <Table.Cell>Data cell</Table.Cell>
            <Table.Cell>Data cell</Table.Cell>
            <Table.Cell data-testid="sticky">Sticky cell 2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Data cell</Table.Cell>
            <Table.Cell>Data cell</Table.Cell>
            <Table.Cell>Data cell</Table.Cell>
            <Table.Cell data-testid="sticky">Sticky cell 3</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )

    getAllByTestId('sticky').forEach((element) => {
      expect(element).toHaveStyle('position: sticky')
    })
  })
})
