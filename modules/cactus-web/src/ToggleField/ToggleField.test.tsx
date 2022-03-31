import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import pick from 'lodash/pick'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import ToggleField from './ToggleField'

// Use this to avoid PropTypes error regarding readonly field.
const noop = () => undefined

describe('component: ToggleField', () => {
  test('should generate unique id when one is not provided', () => {
    const { getByLabelText } = renderWithTheme(
      <ToggleField
        label="Show me the money"
        name="show-me-the-money"
        checked={true}
        onChange={noop}
      />
    )

    expect(getByLabelText('Show me the money').id).toContain('show-me-the-money')
  })

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByLabelText } = renderWithTheme(
      <ToggleField label="Show me the money" name="show-me-the-money" defaultChecked ref={ref} />
    )
    expect(getByLabelText('Show me the money')).toBe(ref.current)
    expect(ref.current).toBeChecked()
  })

  test('should trigger onChange event with next value', () => {
    const box: any = {}
    const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'checked'])))
    const { getByLabelText } = renderWithTheme(
      <ToggleField
        label="Show me the money"
        name="show-me-the-money"
        checked={true}
        onChange={onChange}
      />
    )

    fireEvent.click(getByLabelText('Show me the money'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(box).toEqual({ name: 'show-me-the-money', checked: false })
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <ToggleField
        label="Strange Nights"
        name="strange_nights"
        checked={false}
        onFocus={onFocus}
        onChange={noop}
      />
    )

    fireEvent.focus(getByLabelText('Strange Nights'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <ToggleField label="Washed." name="washed" checked={false} onBlur={onBlur} onChange={noop} />
    )

    fireEvent.blur(getByLabelText('Washed.'))
    expect(onBlur).toHaveBeenCalled()
  })

  describe('when disabled', () => {
    test('should not trigger onChange event', () => {
      const onChange = jest.fn()
      const { getByLabelText } = renderWithTheme(
        <ToggleField label="Flow" name="flow" checked={false} onChange={onChange} disabled />
      )

      userEvent.click(getByLabelText('Flow'))
      expect(onChange).not.toHaveBeenCalled()
    })

    test('should not trigger onFocus event', () => {
      const onFocus = jest.fn()
      const { getByLabelText } = renderWithTheme(
        <ToggleField
          label="Not For Sale"
          name="not_for_sale"
          checked={true}
          onFocus={onFocus}
          disabled
        />
      )

      userEvent.click(getByLabelText('Not For Sale'))
      expect(onFocus).not.toHaveBeenCalled()
    })
  })
})
