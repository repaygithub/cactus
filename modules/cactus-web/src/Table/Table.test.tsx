import { cleanup, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Table from './Table'

afterEach(cleanup)

describe('component: Table', (): void => {
  test('regular table', (): void => {
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

    expect(container).toMatchSnapshot()
  })

  test('table with no header', (): void => {
    const { container } = render(
      <StyleProvider>
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
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

    expect(container).toMatchSnapshot()
  })

  test('table with caption', (): void => {
    const { container } = render(
      <StyleProvider>
        <Table>
          <caption>I'm a caption</caption>
          <Table.Header>
            <Table.Cell>Header Cell</Table.Cell>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
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

    expect(container).toMatchSnapshot()
  })

  test('card carousel', (): void => {
    const { container } = render(
      <StyleProvider>
        <Table variant="card">
          <Table.Header>
            <Table.Cell>Header Cell</Table.Cell>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Data cell</Table.Cell>
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

    expect(container).toMatchSnapshot()
  })
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
    expect(singleCell).toHaveStyle('width: 272px')
  })
})
