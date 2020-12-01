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
  test('should render a toggle', (): void => {
    const toggle = render(
      <StyleProvider>
        <Toggle checked={false} onChange={noop} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled toggle', (): void => {
    const toggle = render(
      <StyleProvider>
        <Toggle checked={false} disabled={true} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should initialize checked to true', (): void => {
    const toggle = render(
      <StyleProvider>
        <Toggle checked={true} onChange={noop} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', (): void => {
    const toggle = render(
      <StyleProvider>
        <Toggle checked={false} marginBottom={4} onChange={noop} />
      </StyleProvider>
    )

    expect(toggle.asFragment()).toMatchSnapshot()
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
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Toggle />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
