import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import ToggleField from './ToggleField'

describe('component: ToggleField', (): void => {
  test('snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <ToggleField id="static-id" name="is_enabled" label="Enabled" value={false} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('snapshot when value=true', (): void => {
    const { container } = render(
      <StyleProvider>
        <ToggleField id="static-id" name="is_enabled" label="Enabled" value={true} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('snapshot when disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <ToggleField id="static-id" name="is_enabled" label="Enabled" value={false} disabled />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should generate unique id when one is not provided', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <ToggleField label="Show me the money" name="show-me-the-money" value={true} />
      </StyleProvider>
    )

    expect(getByLabelText('Show me the money').id).toContain('show-me-the-money')
  })

  test('should trigger onChange event with next value', (): void => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <ToggleField
          label="Show me the money"
          name="show-me-the-money"
          value={true}
          onChange={onChange}
        />
      </StyleProvider>
    )

    fireEvent.click(getByLabelText('Show me the money'))
    expect(onChange).toHaveBeenCalledWith('show-me-the-money', false)
  })

  test('should trigger onFocus event', (): void => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <ToggleField label="Strange Nights" name="strange_nights" value={false} onFocus={onFocus} />
      </StyleProvider>
    )

    fireEvent.focus(getByLabelText('Strange Nights'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', (): void => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <ToggleField label="Washed." name="washed" value={false} onBlur={onBlur} />
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
          <ToggleField label="Flow" name="flow" value={false} onChange={onChange} disabled />
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
            value={true}
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
