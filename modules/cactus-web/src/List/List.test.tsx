import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import List from './List'

describe('component: List', () => {
  test('should render all items', () => {
    const { getByText } = renderWithTheme(
      <List>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List>
    )

    expect(getByText('List Item 1')).toBeInTheDocument()
    expect(getByText('List Item 2')).toBeInTheDocument()
    expect(getByText('List Item 3')).toBeInTheDocument()
  })

  test('should indent nested lists by 24px', () => {
    const { getByTestId } = renderWithTheme(
      <List>
        <List.Item>
          <List data-testid="level-2-nested">
            <List.Item>Indented 24px</List.Item>
            <List.Item>
              I am not indented further
              <List data-testid="level-3-nested">
                <List.Item>But I am</List.Item>
              </List>
            </List.Item>
          </List>
        </List.Item>
      </List>
    )

    expect(getByTestId('level-2-nested')).toHaveStyle('margin-left: 24px')
    expect(getByTestId('level-3-nested')).toHaveStyle('margin-left: 24px')
  })

  test('should be able to set headers', () => {
    const { getByText } = renderWithTheme(
      <List>
        <List.Item>
          <List.ItemHeader>I am a header</List.ItemHeader>I am the content
        </List.Item>
      </List>
    )

    expect(getByText('I am a header')).toHaveStyle('font-weight: 600')
  })

  test('should be able to render headers as other elements', () => {
    const { getByText } = renderWithTheme(
      <List>
        <List.Item>
          <List.ItemHeader as="h3">I am an h3 header</List.ItemHeader>I am the content
        </List.Item>
      </List>
    )

    const header = getByText('I am an h3 header')

    expect(header.tagName).toBe('H3')
  })

  test('should support flex item props', () => {
    const { getByTestId } = renderWithTheme(
      <List data-testid="flex-list" flex={1} flexGrow={1} flexShrink={0} flexBasis={0}>
        <List.Item>List Item 1</List.Item>
        <List.Item>List Item 2</List.Item>
        <List.Item>List Item 3</List.Item>
      </List>
    )

    const list = getByTestId('flex-list')
    expect(list).toHaveStyle('flex: 1')
    expect(list).toHaveStyle('flex-grow: 1')
    expect(list).toHaveStyle('flex-shrink: 0')
    expect(list).toHaveStyle('flex-basis: 0')
  })
})
