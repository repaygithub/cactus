import { fireEvent, queryByAttribute } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import pick from 'lodash/pick'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import CheckBoxField from './CheckBoxField'

describe('component: CheckBoxField', () => {
  test('should generate unique id when one is not provided', () => {
    const { container, getByText } = renderWithTheme(
      <CheckBoxField label="Scoreboard" name="scoreboard" />
    )

    const getById = queryByAttribute.bind(null, 'id')

    const labelElement = getByText('Scoreboard') as HTMLLabelElement
    expect(labelElement.htmlFor).toContain('scoreboard')
    expect(getById(container, labelElement.htmlFor)).not.toBeNull()
  })

  test('should support margin space props', () => {
    const { getByTestId } = renderWithTheme(
      <>
        <CheckBoxField label="F" name="1st" data-testid="first" />
        <CheckBoxField name="def" label="D" data-testid="default" mb={2} />
        <CheckBoxField name="over" label="O" data-testid="override" mt={4} />
      </>
    )

    const blank = { marginTop: '', marginRight: '', marginBottom: '', marginLeft: '' }
    expect(getByTestId('first').parentElement?.parentElement).toHaveStyle(blank)
    expect(getByTestId('default').parentElement?.parentElement).toHaveStyle({
      ...blank,
      marginTop: '8px',
      marginBottom: '4px',
    })
    expect(getByTestId('override').parentElement?.parentElement).toHaveStyle({
      ...blank,
      marginTop: '16px',
    })
    // Make sure the margin props aren't passed through to the CheckBox component.
    expect(getByTestId('default')).toHaveStyle(blank)
    expect(getByTestId('default').parentElement).toHaveStyle(blank)
  })

  test('should support flex item props', () => {
    const { getByTestId } = renderWithTheme(
      <CheckBoxField
        label="space props"
        name="space_props"
        id="not-random"
        flex={1}
        flexGrow={1}
        flexShrink={0}
        flexBasis={0}
        data-testid="flex-checkbox"
      />
    )

    const checkField = getByTestId('flex-checkbox').parentElement?.parentElement as HTMLElement
    expect(checkField).toHaveStyle('flex: 1')
    expect(checkField).toHaveStyle('flex-grow: 1')
    expect(checkField).toHaveStyle('flex-shrink: 0')
    expect(checkField).toHaveStyle('flex-basis: 0')
  })

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByLabelText } = renderWithTheme(
      <CheckBoxField label="Oui" defaultChecked ref={ref} />
    )
    expect(getByLabelText('Oui')).toBe(ref.current)
    expect(ref.current).toBeChecked()
  })

  test('should trigger onChange event', () => {
    const box: any = {}
    const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'checked'])))
    const { getByLabelText } = renderWithTheme(
      <CheckBoxField label="Katastro" name="katastro" defaultChecked onChange={onChange} />
    )

    fireEvent.click(getByLabelText('Katastro'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(box).toEqual({ name: 'katastro', checked: false })
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <CheckBoxField label="Strange Nights" name="strange_nights" onFocus={onFocus} />
    )

    fireEvent.focus(getByLabelText('Strange Nights'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <CheckBoxField label="Washed." name="washed" onBlur={onBlur} />
    )

    fireEvent.blur(getByLabelText('Washed.'))
    expect(onBlur).toHaveBeenCalled()
  })

  describe('when disabled', () => {
    test('should not trigger onChange event', () => {
      const onChange = jest.fn()
      const { getByLabelText } = renderWithTheme(
        <CheckBoxField label="Flow" name="flow" onChange={onChange} disabled />
      )

      userEvent.click(getByLabelText('Flow'))
      expect(onChange).not.toHaveBeenCalled()
    })

    test('should not trigger onFocus event', () => {
      const onFocus = jest.fn()
      const { getByLabelText } = renderWithTheme(
        <CheckBoxField label="Not For Sale" name="not_for_sale" onFocus={onFocus} disabled />
      )

      userEvent.click(getByLabelText('Not For Sale'))
      expect(onFocus).not.toHaveBeenCalled()
    })
  })
})
