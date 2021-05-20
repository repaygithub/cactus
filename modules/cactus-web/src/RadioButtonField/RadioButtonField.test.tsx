import { fireEvent, queryByAttribute, render } from '@testing-library/react'
import pick from 'lodash/pick'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import RadioButtonField from './RadioButtonField'

describe('component: RadioButtonField', (): void => {
  test('should generate a unique id when none is provided', (): void => {
    const { container, getByText } = render(
      <StyleProvider>
        <RadioButtonField name="field_name" label="Find This" />
      </StyleProvider>
    )

    const getById = queryByAttribute.bind(null, 'id')

    const labelElement = getByText('Find This') as HTMLLabelElement
    expect(labelElement.htmlFor).toContain('field_name')
    expect(getById(container, labelElement.htmlFor)).not.toBeNull()
  })

  test('should trigger onChange event', (): void => {
    const box: any = {}
    const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButtonField id="Ackermann" name="rbf" label="Levi" onChange={onChange} />
      </StyleProvider>
    )

    fireEvent.click(getByLabelText('Levi'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(box).toEqual({ name: 'rbf', value: 'on' })
  })

  test('should trigger onFocus event', (): void => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButtonField id="Yeager" name="rbf" label="Eren" onFocus={onFocus} />
      </StyleProvider>
    )

    fireEvent.focus(getByLabelText('Eren'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', (): void => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButtonField id="Targaryen" name="rbf" label="Aegon" onBlur={onBlur} />
      </StyleProvider>
    )

    fireEvent.blur(getByLabelText('Aegon'))
    expect(onBlur).toHaveBeenCalled()
  })
})
