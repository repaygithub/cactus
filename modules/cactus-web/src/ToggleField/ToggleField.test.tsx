import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import pick from 'lodash/pick'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import ToggleField from './ToggleField'

// Use this to avoid PropTypes error regarding readonly field.
const noop = () => undefined

describe('component: ToggleField', (): void => {
  test('snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <ToggleField
          id="static-id"
          name="is_enabled"
          label="Enabled"
          checked={false}
          onChange={noop}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('snapshot when checked=true', (): void => {
    const { container } = render(
      <StyleProvider>
        <ToggleField
          id="static-id"
          name="is_enabled"
          label="Enabled"
          checked={true}
          onChange={noop}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('snapshot when disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <ToggleField id="static-id" name="is_enabled" label="Enabled" checked={false} disabled />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should generate unique id when one is not provided', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <ToggleField
          label="Show me the money"
          name="show-me-the-money"
          checked={true}
          onChange={noop}
        />
      </StyleProvider>
    )

    expect(getByLabelText('Show me the money').id).toContain('show-me-the-money')
  })

  test('should trigger onChange event with next value', (): void => {
    const box: any = {}
    const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'checked'])))
    const { getByLabelText } = render(
      <StyleProvider>
        <ToggleField
          label="Show me the money"
          name="show-me-the-money"
          checked={true}
          onChange={onChange}
        />
      </StyleProvider>
    )

    fireEvent.click(getByLabelText('Show me the money'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(box).toEqual({ name: 'show-me-the-money', checked: false })
  })

  test('should trigger onFocus event', (): void => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <ToggleField
          label="Strange Nights"
          name="strange_nights"
          checked={false}
          onFocus={onFocus}
          onChange={noop}
        />
      </StyleProvider>
    )

    fireEvent.focus(getByLabelText('Strange Nights'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', (): void => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <ToggleField
          label="Washed."
          name="washed"
          checked={false}
          onBlur={onBlur}
          onChange={noop}
        />
      </StyleProvider>
    )

    fireEvent.blur(getByLabelText('Washed.'))
    expect(onBlur).toHaveBeenCalled()
  })

  describe('when disabled', (): void => {
    test('should not trigger onChange event', (): void => {
      const onChange = jest.fn()
      const { getByLabelText } = render(
        <StyleProvider>
          <ToggleField label="Flow" name="flow" checked={false} onChange={onChange} disabled />
        </StyleProvider>
      )

      userEvent.click(getByLabelText('Flow'))
      expect(onChange).not.toHaveBeenCalled()
    })

    test('should not trigger onFocus event', (): void => {
      const onFocus = jest.fn()
      const { getByLabelText } = render(
        <StyleProvider>
          <ToggleField
            label="Not For Sale"
            name="not_for_sale"
            checked={true}
            onFocus={onFocus}
            disabled
          />
        </StyleProvider>
      )

      userEvent.click(getByLabelText('Not For Sale'))
      expect(onFocus).not.toHaveBeenCalled()
    })
  })
})
