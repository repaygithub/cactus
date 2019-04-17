import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import CheckBox from './CheckBox'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: CheckBox', () => {
  test('should render a checkbox', () => {
    const checkBox = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="check" />
      </ThemeProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled checkbox', () => {
    const checkBox = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checking" disabled />
      </ThemeProvider>
    )

    expect(checkBox.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checked" onChange={onChange} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('will-check'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checked" onFocus={onFocus} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.focus(getByTestId('will-check'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBox id="checked" onBlur={onBlur} data-testid="will-check" />
      </ThemeProvider>
    )

    fireEvent.blur(getByTestId('will-check'))
    expect(onBlur).toHaveBeenCalled()
  })

  /* TODO: Change events are still being fired when clicked even when disabled. There is a PR for the user-event library
  that should be included in v2 since it is a breaking change. We'll have to stay on the lookout for that version
  and finish these tests afterward https://github.com/Gpx/user-event/pull/97 */
})
