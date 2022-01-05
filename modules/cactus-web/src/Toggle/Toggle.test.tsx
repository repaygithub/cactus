import { generateTheme } from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import pick from 'lodash/pick'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Toggle from './Toggle'

// Use this to avoid PropTypes error regarding readonly field.
const noop = () => undefined

describe('component: Toggle', (): void => {
  test('should support margin space props', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <Toggle checked={false} marginBottom={4} onChange={noop} data-testid="toggle" />
      </StyleProvider>
    )
    const toggle = getByTestId('toggle').parentElement
    const style = window.getComputedStyle(toggle as HTMLElement)

    expect(style.marginBottom).toBe('16px')
  })

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByTestId } = render(
      <StyleProvider>
        <Toggle data-testid="toggle" defaultChecked ref={ref} />
      </StyleProvider>
    )
    expect(getByTestId('toggle')).toBe(ref.current)
    expect(ref.current).toBeChecked()
  })

  test('should trigger onChange event', (): void => {
    const box: any = {}
    const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['id', 'checked'])))
    const { container } = render(
      <StyleProvider>
        <Toggle checked={false} onChange={onChange} id="will-change" />
      </StyleProvider>
    )

    userEvent.click(container.querySelector('#will-change') as Element)
    expect(onChange).toHaveBeenCalled()
    expect(box).toEqual({ id: 'will-change', checked: true })
  })

  test('should not trigger onChange event', (): void => {
    const onChange = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <Toggle disabled onChange={onChange} data-testid="will-not-change" />
      </StyleProvider>
    )

    userEvent.click(getByTestId('will-not-change'))
    expect(onChange).not.toHaveBeenCalled()
  })

  describe('with theme customization', (): void => {
    test('should not have box shadows on focus', (): void => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { getByTestId } = render(
        <StyleProvider theme={theme}>
          <Toggle data-testid="toggle" />
        </StyleProvider>
      )

      const toggle = getByTestId('toggle')
      const style = window.getComputedStyle(toggle)

      expect(style.boxShadow).toBe('')
    })
  })
})
