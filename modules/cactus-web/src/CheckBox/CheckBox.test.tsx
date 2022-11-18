import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import CheckBox from './CheckBox'

describe('component: CheckBox', () => {
  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = renderWithTheme(
      <CheckBox id="checked" onChange={onChange} data-testid="will-check" />
    )

    fireEvent.click(getByTestId('will-check'))
    expect(onChange).toHaveBeenCalled()
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = renderWithTheme(
      <CheckBox id="checked" onFocus={onFocus} data-testid="will-check" />
    )

    fireEvent.focus(getByTestId('will-check'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByTestId } = renderWithTheme(
      <CheckBox id="checked" onBlur={onBlur} data-testid="will-check" />
    )

    fireEvent.blur(getByTestId('will-check'))
    expect(onBlur).toHaveBeenCalled()
  })

  test('should not trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = renderWithTheme(
      <CheckBox id="checked" onChange={onChange} data-testid="will-not-check" disabled />
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onChange).not.toHaveBeenCalled()
  })

  test('should not trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByTestId } = renderWithTheme(
      <CheckBox id="checked" onFocus={onFocus} data-testid="will-not-check" disabled />
    )

    userEvent.click(getByTestId('will-not-check'))
    expect(onFocus).not.toHaveBeenCalled()
  })

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByTestId } = renderWithTheme(
      <CheckBox data-testid="inreffable" defaultChecked ref={ref} />
    )
    expect(getByTestId('inreffable')).toBe(ref.current)
    expect(ref.current).toBeChecked()
  })

  describe('with theme customization', () => {
    test('should have 2px border', () => {
      const { getByTestId } = renderWithTheme(<CheckBox id="theme" data-testid="checkbox" />, {
        border: 'thick',
      })
      expect(getByTestId('checkbox').nextElementSibling).toHaveStyle({ borderWidth: '2px' })
    })

    test('should support margin props', () => {
      const { getByTestId } = renderWithTheme(<CheckBox m={5} data-testid="checkbox" />)
      expect(getByTestId('checkbox').parentElement).toHaveStyle({ margin: '24px' })
    })
  })
})
