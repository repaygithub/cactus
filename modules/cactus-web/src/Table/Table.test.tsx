import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Table from './Table'

afterEach(cleanup)

describe('component: Table', () => {
  test('regular table', () => {
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

  test('table with no header', () => {
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

  test('table with caption', () => {
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

  test('card carousel', () => {
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
})
