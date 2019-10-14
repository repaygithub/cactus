import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Toggle from './Toggle'

afterEach(cleanup)

describe('component: Toggle', () => {
  test('should render a toggle', () => {
    const toggle = render(
      <StyleProvider>
        <Toggle value={false} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled toggle', () => {
    const toggle = render(
      <StyleProvider>
        <Toggle value={false} disabled={true} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should initialize value to true', () => {
    const toggle = render(
      <StyleProvider>
        <Toggle value={true} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const toggle = render(
      <StyleProvider>
        <Toggle value={false} marginBottom={4} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should trigger onClick event', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <Toggle value={false} onClick={onClick} data-testid="will-click" />
      </StyleProvider>
    )

    fireEvent.click(getByTestId('will-click'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick event', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <Toggle value={false} onClick={onClick} disabled={true} data-testid="will-not-click" />
      </StyleProvider>
    )

    fireEvent.click(getByTestId('will-not-click'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
