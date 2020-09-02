import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Tag from './Tag'

describe('component: Tag', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Tag />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
