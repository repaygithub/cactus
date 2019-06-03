import * as React from 'react'

import { cleanup, render } from 'react-testing-library'
import { Theme } from 'styled-system'
import { withTheme } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'
import StyleProvider from './StyleProvider'

interface TestComponentProps {
  theme: Theme
}

const TestComponentBase = (props: TestComponentProps) => {
  return <div>{props.theme !== undefined ? 'theme included' : 'no theme included'}</div>
}

const TestComponent = withTheme(TestComponentBase)

afterEach(cleanup)

describe('component: StyleProvider', () => {
  test('should provide the theme to children', () => {
    const { container } = render(
      <StyleProvider theme={cactusTheme}>
        <TestComponent />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should provide a default theme to children', () => {
    const { container } = render(
      <StyleProvider>
        <TestComponent />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
