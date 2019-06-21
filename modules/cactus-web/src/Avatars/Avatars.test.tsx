import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import Avatars from './Avatars'
import cactusTheme from '@repay/cactus-theme'
import { StyleProvider } from '../StyleProvider/StyleProvider'

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
