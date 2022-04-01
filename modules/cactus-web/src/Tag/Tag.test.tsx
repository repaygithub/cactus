import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Tag from './Tag'

describe('component: Tag', () => {
  test('can render content as children', () => {
    const { getByText } = renderWithTheme(<Tag>Test label</Tag>)

    expect(getByText('Test label')).toBeInTheDocument()
  })

  test('Close button is present', () => {
    const { container } = renderWithTheme(
      <Tag id="tag-one" closeOption>
        Test label
      </Tag>
    )

    const icon = container.querySelector('button')
    expect(icon).toHaveAttribute('aria-controls', 'tag-one')
  })

  test('Close icon is present', () => {
    const { container } = renderWithTheme(
      <Tag id="tag-one" closeOption="no-button">
        Test label
      </Tag>
    )

    const icon = container.querySelector('span[aria-controls]')
    expect(icon).toHaveAttribute('aria-controls', 'tag-one')
    expect(icon).toHaveAttribute('aria-label', 'close')
  })

  test('Close icon is not present', () => {
    const { container } = renderWithTheme(<Tag>Test label</Tag>)

    const icon = container.querySelector('svg')
    expect(icon).not.toBeInTheDocument()
  })
})
