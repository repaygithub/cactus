import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Pagination from './Pagination'

function ManagedPagination({ size, start, onClick }: any): React.ReactElement {
  const [current, setCurrent] = React.useState(start)
  const callback = !onClick
    ? setCurrent
    : (page: number) => {
        onClick(page)
        setCurrent(page)
      }
  return <Pagination currentPage={current} pageCount={size} onPageChange={callback} />
}

const expectIcon = (node: HTMLElement, disabled: boolean, label: string) => {
  expect(node.childNodes).toHaveLength(1)
  expect((node.firstChild as HTMLElement).tagName).toBe('svg')
  expect(node).toHaveAttribute('aria-label', label)
  if (disabled) {
    expect(node).toHaveAttribute('aria-disabled', 'true')
  } else {
    expect(node).not.toHaveAttribute('aria-disabled')
  }
}

const expectPageLink = (node: HTMLElement, page: number, currentPage: number) => {
  expect(node).toHaveTextContent(`${page}`)
  if (page === currentPage) {
    expect(node).toHaveAttribute('aria-label', `Current page, ${page}`)
    expect(node).toHaveAttribute('aria-disabled', 'true')
    expect(node).toHaveAttribute('aria-current', 'page')
  } else {
    expect(node).toHaveAttribute('aria-label', `Go to page ${page}`)
    expect(node).not.toHaveAttribute('aria-disabled')
    expect(node).not.toHaveAttribute('aria-current')
  }
}

const assertPages = (
  links: HTMLElement[],
  size: number,
  currentPage: number,
  hiddenPages: number[]
) => {
  const length = size - hiddenPages.length + 4
  expect(links).toHaveLength(length)
  expect(length).toBeLessThan(14)

  const prevPage = Math.max(1, currentPage - 1)
  expectIcon(links[0], currentPage === 1, 'Go to page 1')
  expectIcon(links[1], currentPage <= 1, `Go to previous page, ${prevPage}`)
  expect(links[1]).toHaveAttribute('rel', 'prev')

  let page = 1
  for (let ix = 2; ix < length - 2; ix++) {
    while (hiddenPages.includes(page)) {
      page += 1
    }
    expectPageLink(links[ix], page++, currentPage)
  }

  const nextPage = Math.min(size, currentPage + 1)
  expectIcon(links[length - 2], currentPage >= size, `Go to next page, ${nextPage}`)
  expect(links[length - 2]).toHaveAttribute('rel', 'next')
  expectIcon(links[length - 1], currentPage === size, `Go to last page, ${size}`)
}

describe('component: Pagination', () => {
  test('11 pages, first page selected', () => {
    const { getAllByRole } = renderWithTheme(<ManagedPagination size={11} start={1} />)
    assertPages(getAllByRole('link'), 11, 1, [9, 10, 11])
  })

  test('11 pages, go to middle page', () => {
    const { getAllByRole, getByLabelText } = renderWithTheme(
      <ManagedPagination size={11} start={1} />
    )
    userEvent.click(getByLabelText('Go to page 6'))
    assertPages(getAllByRole('link'), 11, 6, [1, 2, 10, 11])
  })

  test('11 pages, go to next page', () => {
    const { getAllByRole, getByLabelText } = renderWithTheme(
      <ManagedPagination size={11} start={6} />
    )
    userEvent.click(getByLabelText('Go to next page, 7'))
    assertPages(getAllByRole('link'), 11, 7, [1, 2, 3])
  })

  test('11 pages, go to previous page', () => {
    const { getAllByRole, getByLabelText } = renderWithTheme(
      <ManagedPagination size={11} start={5} />
    )
    userEvent.click(getByLabelText('Go to previous page, 4'))
    assertPages(getAllByRole('link'), 11, 4, [9, 10, 11])
  })

  test('11 pages, go to first page', () => {
    const { getAllByRole, getByLabelText } = renderWithTheme(
      <ManagedPagination size={11} start={6} />
    )
    userEvent.click(getByLabelText('Go to page 1'))
    assertPages(getAllByRole('link'), 11, 1, [9, 10, 11])
  })

  test('11 pages, go to last page', () => {
    const { getAllByRole, getByLabelText } = renderWithTheme(
      <ManagedPagination size={11} start={5} />
    )
    userEvent.click(getByLabelText('Go to last page, 11'))
    assertPages(getAllByRole('link'), 11, 11, [1, 2, 3])
  })

  test('9 pages, no hidden pages', () => {
    const { getAllByRole, getByLabelText } = renderWithTheme(
      <ManagedPagination size={9} start={1} />
    )
    assertPages(getAllByRole('link'), 9, 1, [])
    userEvent.click(getByLabelText('Go to last page, 9'))
    assertPages(getAllByRole('link'), 9, 9, [])
  })

  test('test onclick for disabled buttons', () => {
    const func = jest.fn()

    const { getAllByRole } = renderWithTheme(
      <ManagedPagination size={2} start={1} onClick={func} />
    )

    const links = getAllByRole('link')
    for (const link of links.slice(0, 3)) {
      userEvent.click(link)
    }
    expect(func).not.toHaveBeenCalled()
    userEvent.click(links[3])
    expect(func).toHaveBeenCalledWith(2)
    for (const link of getAllByRole('link').slice(3)) {
      userEvent.click(link)
    }
    expect(func).toHaveBeenCalledTimes(1)
  })
})
