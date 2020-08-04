import { generateTheme } from '@repay/cactus-theme'
import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Toggle from './Toggle'

afterEach(cleanup)

describe('component: Toggle', (): void => {
  test('should render a toggle', (): void => {
    const toggle = render(
      <StyleProvider>
        <Toggle value={false} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled toggle', (): void => {
    const toggle = render(
      <StyleProvider>
        <Toggle value={false} disabled={true} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should initialize value to true', (): void => {
    const toggle = render(
      <StyleProvider>
        <Toggle value={true} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', (): void => {
    const toggle = render(
      <StyleProvider>
        <Toggle value={false} marginBottom={4} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should trigger onClick event', (): void => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <Toggle value={false} onClick={onClick} data-testid="will-click" />
      </StyleProvider>
    )

    fireEvent.click(getByTestId('will-click'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick event', (): void => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <Toggle value={false} onClick={onClick} disabled={true} data-testid="will-not-click" />
      </StyleProvider>
    )

    fireEvent.click(getByTestId('will-not-click'))
    expect(onClick).not.toHaveBeenCalled()
  })

  describe('with theme customization', (): void => {
    test('should not have box shadows on focus', (): void => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Toggle />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
