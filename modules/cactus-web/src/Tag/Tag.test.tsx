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
  test('Close icon is present', () => {
    const onClick = jest.fn()
    const { container } = render(
      <StyleProvider>
        <Tag closeOption onCloseIconClick={onClick}>
          Test label
        </Tag>
      </StyleProvider>
    )

    const icon = container.querySelector('svg')
    expect(icon).toHaveAttribute('data-role', 'close')
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
