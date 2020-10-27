import cactusTheme from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import * as React from 'react'
import { DefaultTheme, withTheme } from 'styled-components'

import StyleProvider from './StyleProvider'

interface TestComponentProps {
  theme: DefaultTheme
}

const TestComponentBase = (props: TestComponentProps): React.ReactElement => {
  return <div>{props.theme !== undefined ? 'theme included' : 'no theme included'}</div>
}

const TestComponent = withTheme(TestComponentBase)

describe('component: StyleProvider', (): void => {
  test('should provide the theme to children', (): void => {
    const { container } = render(
      <StyleProvider theme={cactusTheme}>
        <TestComponent />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should provide a default theme to children', (): void => {
    const { container } = render(
      <StyleProvider>
        <TestComponent />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
