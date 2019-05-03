import * as React from 'react'

import { cleanup, fireEvent, queryByAttribute, render } from 'react-testing-library'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'
import CheckBoxField from './CheckBoxField'
import userEvent from 'user-event'

afterEach(cleanup)

describe('component: CheckBoxField', () => {
  test('should render a checkbox field', () => {
    const checkboxField = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="SoIA" id="my-id" name="checkbox-test" />
      </ThemeProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled checkbox field', () => {
    const checkboxField = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="NMNL" id="my-id" name="checkbox-test" disabled />
      </ThemeProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should generate unique id when one is not provided', () => {
    const { container, getByText } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Scoreboard" name="scoreboard" />
      </ThemeProvider>
    )

    const getById = queryByAttribute.bind(null, 'id')

    const labelElement = getByText('Scoreboard') as HTMLLabelElement
    expect(labelElement.htmlFor).toContain('scoreboard')
    expect(getById(container, labelElement.htmlFor)).not.toBeNull()
  })

  test('should support margin space props', () => {
    const checkboxField = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="space props" name="space_props" id="not-random" mr={3} />
      </ThemeProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Katastro" name="katastro" onChange={onChange} />
      </ThemeProvider>
    )

    fireEvent.click(getByLabelText('Katastro'))
    expect(onChange).toHaveBeenCalledWith('katastro', true)
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Strange Nights" name="strange_nights" onFocus={onFocus} />
      </ThemeProvider>
    )

    fireEvent.focus(getByLabelText('Strange Nights'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <CheckBoxField label="Washed." name="washed" onBlur={onBlur} />
      </ThemeProvider>
    )

    fireEvent.blur(getByLabelText('Washed.'))
    expect(onBlur).toHaveBeenCalled()
  })

  describe('when disabled', () => {
    test('should not trigger onChange event', () => {
      const onChange = jest.fn()
      const { getByLabelText } = render(
        <ThemeProvider theme={cactusTheme}>
          <CheckBoxField label="Flow" name="flow" onChange={onChange} disabled />
        </ThemeProvider>
      )

      userEvent.click(getByLabelText('Flow'))
      expect(onChange).not.toHaveBeenCalled()
    })

    test('should not trigger onFocus event', () => {
      const onFocus = jest.fn()
      const { getByLabelText } = render(
        <ThemeProvider theme={cactusTheme}>
          <CheckBoxField label="Not For Sale" name="not_for_sale" onFocus={onFocus} disabled />
        </ThemeProvider>
      )

      userEvent.click(getByLabelText('Not For Sale'))
      expect(onFocus).not.toHaveBeenCalled()
    })
  })
})
