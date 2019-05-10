import * as React from 'react'

import { cleanup, fireEvent, queryByAttribute, render } from 'react-testing-library'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'
import RadioButtonField from './RadioButtonField'

afterEach(cleanup)

describe('component: RadioButtonField', () => {
  test('should render a radio button field', () => {
    const { container } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButtonField id="rb" name="rb" label="My Label" />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a disabled radio button field', () => {
    const { container } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButtonField id="rb" name="rb" label="My Label" disabled />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should generate a unique id when none is provided', () => {
    const { container, getByText } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButtonField name="field_name" label="Find This" />
      </ThemeProvider>
    )

    const getById = queryByAttribute.bind(null, 'id')

    const labelElement = getByText('Find This') as HTMLLabelElement
    expect(labelElement.htmlFor).toContain('field_name')
    expect(getById(container, labelElement.htmlFor)).not.toBeNull()
  })

  test('should support margin space props', () => {
    const { container } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButtonField id="Ackermann" name="rbf" label="Mikasa" marginLeft={3} />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButtonField id="Ackermann" name="rbf" label="Levi" onChange={onChange} />
      </ThemeProvider>
    )

    fireEvent.click(getByLabelText('Levi'))
    expect(onChange).toHaveBeenCalledWith('rbf', 'on')
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButtonField id="Yeager" name="rbf" label="Eren" onFocus={onFocus} />
      </ThemeProvider>
    )

    fireEvent.focus(getByLabelText('Eren'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <RadioButtonField id="Targaryen" name="rbf" label="Aegon" onBlur={onBlur} />
      </ThemeProvider>
    )

    fireEvent.blur(getByLabelText('Aegon'))
    expect(onBlur).toHaveBeenCalled()
  })
})
