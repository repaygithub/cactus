import userEvent from '@testing-library/user-event'
import pick from 'lodash/pick'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Toggle from './Toggle'

// Use this to avoid PropTypes error regarding readonly field.
const noop = () => undefined

describe('component: Toggle', () => {
  test('Should support margin space props', () => {
    const { getByTestId } = renderWithTheme(
      <Toggle checked={false} marginBottom={4} onChange={noop} data-testid="toggle" />
    )
    const toggle = getByTestId('toggle').parentElement
    const style = window.getComputedStyle(toggle as HTMLElement)

    expect(style.marginBottom).toBe('16px')
  })

  test('Should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByTestId } = renderWithTheme(
      <Toggle data-testid="toggle" defaultChecked ref={ref} />
    )
    expect(getByTestId('toggle')).toBe(ref.current)
    expect(ref.current).toBeChecked()
  })

  test('Should trigger onChange event', () => {
    const box: any = {}
    const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['id', 'checked'])))
    const { container } = renderWithTheme(
      <Toggle checked={false} onChange={onChange} id="will-change" />
    )

    userEvent.click(container.querySelector('#will-change') as Element)
    expect(onChange).toHaveBeenCalled()
    expect(box).toEqual({ id: 'will-change', checked: true })
  })

  test('Should not trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByTestId } = renderWithTheme(
      <Toggle disabled onChange={onChange} data-testid="will-not-change" />
    )

    userEvent.click(getByTestId('will-not-change'))
    expect(onChange).not.toHaveBeenCalled()
  })

  describe('with theme customization', () => {
    test('Should not have box shadows on focus', () => {
      const { getByTestId } = renderWithTheme(<Toggle data-testid="toggle" />, {
        boxShadows: false,
      })

      const toggle = getByTestId('toggle')
      const style = window.getComputedStyle(toggle)

      expect(style.boxShadow).toBe('')
    })
  })
})
