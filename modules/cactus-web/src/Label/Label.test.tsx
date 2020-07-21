import cactusTheme from '@repay/cactus-theme'
import { cleanup, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Label from './Label'

afterEach(cleanup)

describe('component: Label', () => {
  test('should render a label component', () => {
    const label = render(
      <StyleProvider>
        <Label>It is important to label UI elements</Label>
      </StyleProvider>
    )

    expect(label.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const label = render(
      <StyleProvider>
        <Label ml={2} />
      </StyleProvider>
    )

    expect(label.asFragment()).toMatchSnapshot()
  })
})
