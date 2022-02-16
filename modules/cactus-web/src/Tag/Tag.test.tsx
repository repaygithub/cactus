import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Tag from './Tag'

describe('component: Tag', () => {
  test('can render content as children', () => {
    const { getByText } = render(
      <StyleProvider>
        <Tag>Test label</Tag>
      </StyleProvider>
    )

    expect(getByText('Test label')).toBeInTheDocument()
  })

  test('Close button is present', () => {
    const { container } = render(
      <StyleProvider>
        <Tag id="tag-one" closeOption>
          Test label
        </Tag>
      </StyleProvider>
    )

    const icon = container.querySelector('button')
    expect(icon).toHaveAttribute('aria-controls', 'tag-one')
  })

  test('Close icon is present', () => {
    const { container } = render(
      <StyleProvider>
        <Tag id="tag-one" closeOption="no-button">
          Test label
        </Tag>
      </StyleProvider>
    )

    const icon = container.querySelector('span[aria-controls]')
    expect(icon).toHaveAttribute('aria-controls', 'tag-one')
    expect(icon).toHaveAttribute('aria-label', 'close')
  })

  test('Close icon is not present', () => {
    const { container } = render(
      <StyleProvider>
        <Tag>Test label</Tag>
      </StyleProvider>
    )

    const icon = container.querySelector('svg')
    expect(icon).not.toBeInTheDocument()
  })
})
