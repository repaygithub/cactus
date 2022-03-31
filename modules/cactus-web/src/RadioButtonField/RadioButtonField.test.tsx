import { fireEvent, queryByAttribute } from '@testing-library/react'
import pick from 'lodash/pick'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import RadioButtonField from './RadioButtonField'

describe('component: RadioButtonField', () => {
  test('should generate a unique id when none is provided', () => {
    const { container, getByText } = renderWithTheme(
      <RadioButtonField name="field_name" label="Find This" />
    )

    const getById = queryByAttribute.bind(null, 'id')

    const labelElement = getByText('Find This') as HTMLLabelElement
    expect(labelElement.htmlFor).toContain('field_name')
    expect(getById(container, labelElement.htmlFor)).not.toBeNull()
  })

  test('should trigger onChange event', () => {
    const box: any = {}
    const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
    const { getByLabelText } = renderWithTheme(
      <RadioButtonField id="Ackermann" name="rbf" label="Levi" onChange={onChange} />
    )

    fireEvent.click(getByLabelText('Levi'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(box).toEqual({ name: 'rbf', value: 'on' })
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <RadioButtonField id="Yeager" name="rbf" label="Eren" onFocus={onFocus} />
    )

    fireEvent.focus(getByLabelText('Eren'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = renderWithTheme(
      <RadioButtonField id="Targaryen" name="rbf" label="Aegon" onBlur={onBlur} />
    )

    fireEvent.blur(getByLabelText('Aegon'))
    expect(onBlur).toHaveBeenCalled()
  })

  test('should support margin space props', () => {
    const { getByTestId } = renderWithTheme(
      <>
        <RadioButtonField label="F" name="1st" data-testid="first" />
        <RadioButtonField name="def" label="D" data-testid="default" mb={2} />
        <RadioButtonField name="over" label="O" data-testid="override" mt={4} />
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
  })

  test('should support flex item props', () => {
    const { getByTestId } = renderWithTheme(
      <RadioButtonField
        id="Targaryen"
        name="rbf"
        label="Aegon"
        data-testid="flex-rbf"
        flex={1}
        flexGrow={1}
        flexShrink={0}
        flexBasis={0}
      />
    )

    const radioField = getByTestId('flex-rbf').parentElement?.parentElement
    expect(radioField).toHaveStyle('flex: 1')
    expect(radioField).toHaveStyle('flex-grow: 1')
    expect(radioField).toHaveStyle('flex-shrink: 0')
    expect(radioField).toHaveStyle('flex-basis: 0')
  })

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByLabelText } = renderWithTheme(
      <RadioButtonField name="yes" label="Oui" defaultChecked ref={ref} />
    )
    expect(getByLabelText('Oui')).toBe(ref.current)
    expect(ref.current).toBeChecked()
  })
})
