import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import cactusTheme from '@repay/cactus-theme'
import Pagination from './Pagination'

afterEach(cleanup)

function ManagedPagination({ size, start }: any) {
  const [current, setCurrent] = React.useState(start)
  return <Pagination current={current} size={size} onPageChange={setCurrent} />
}

describe('component: Pagination', () => {
  test('Should render size 1 with page 1 (only page) selected, both arrow buttons should be disabled', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={1} start={1} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('Should render size 10 with page 10 (last page) selected, right arrow button should be disabled', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={10} start={10} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('Should render size 10 with page 10 (last page) selected, right arrow button should be disabled', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={10} start={9} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('Should render size 10 with page 1 selected, left arrow button should be disabled', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={10} start={1} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('Should render size 10 with page 4 selected', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={10} start={4} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('Should render size 5 with page 5 (last page) selected, right arrow button should be disabled', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={5} start={5} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('Should render size 5 with page 3 selected', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={5} start={3} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('Should render size 3 with page 2 selected', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={3} start={2} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('Should render size 10 with page 4 selected', () => {
    const { container } = render(
      <StyleProvider>
        <ManagedPagination size={80} start={47} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
