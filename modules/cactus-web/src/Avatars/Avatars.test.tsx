import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Avatars from './Avatars'
import cactusTheme from '@repay/cactus-theme'

afterEach(cleanup)

describe('component: Avatars', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
