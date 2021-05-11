import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Avatar from './Avatar'

describe('component: Avatars', (): void => {
  test('Default Avatar', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
