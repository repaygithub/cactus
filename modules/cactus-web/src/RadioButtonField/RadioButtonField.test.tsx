import * as React from 'react'

import { cleanup, fireEvent, queryByAttribute, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import cactusTheme from '@repay/cactus-theme'
import RadioButtonField from './RadioButtonField'

afterEach(cleanup)

describe('component: RadioButtonField', () => {
  test('should render a radio button field', () => {
    const { container } = render(
      <StyleProvider>
        <RadioButtonField id="rb" name="rb" label="My Label" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a disabled radio button field', () => {
    const { container } = render(
      <StyleProvider>
        <RadioButtonField id="rb" name="rb" label="My Label" disabled />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should generate a unique id when none is provided', () => {
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

  test('should support margin space props', () => {
    const { container } = render(
      <StyleProvider>
        <RadioButtonField id="Ackermann" name="rbf" label="Mikasa" marginLeft={4} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButtonField id="Ackermann" name="rbf" label="Levi" onChange={onChange} />
      </StyleProvider>
    )

    fireEvent.click(getByLabelText('Levi'))
    expect(onChange).toHaveBeenCalledWith('rbf', 'on')
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioButtonField id="Yeager" name="rbf" label="Eren" onFocus={onFocus} />
      </StyleProvider>
    )

    fireEvent.focus(getByLabelText('Eren'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
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
