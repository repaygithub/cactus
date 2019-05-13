import * as React from 'react'

import { cleanup, fireEvent, queryByAttribute, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import cactusTheme from '@repay/cactus-theme'
import CheckBoxField from './CheckBoxField'
import userEvent from 'user-event'

afterEach(cleanup)

describe('component: CheckBoxField', () => {
  test('should render a checkbox field', () => {
    const checkboxField = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBoxField label="SoIA" id="my-id" name="checkbox-test" />
      </StyleProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled checkbox field', () => {
    const checkboxField = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBoxField label="NMNL" id="my-id" name="checkbox-test" disabled />
      </StyleProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should generate unique id when one is not provided', () => {
    const { container, getByText } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBoxField label="Scoreboard" name="scoreboard" />
      </StyleProvider>
    )

    const getById = queryByAttribute.bind(null, 'id')

    const labelElement = getByText('Scoreboard') as HTMLLabelElement
    expect(labelElement.htmlFor).toContain('scoreboard')
    expect(getById(container, labelElement.htmlFor)).not.toBeNull()
  })

  test('should support margin space props', () => {
    const checkboxField = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBoxField label="space props" name="space_props" id="not-random" mr={3} />
      </StyleProvider>
    )

    expect(checkboxField.asFragment()).toMatchSnapshot()
  })

  test('should trigger onChange event', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBoxField label="Katastro" name="katastro" onChange={onChange} />
      </StyleProvider>
    )

    fireEvent.click(getByLabelText('Katastro'))
    expect(onChange).toHaveBeenCalledWith('katastro', true)
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBoxField label="Strange Nights" name="strange_nights" onFocus={onFocus} />
      </StyleProvider>
    )

    fireEvent.focus(getByLabelText('Strange Nights'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <StyleProvider theme={cactusTheme}>
        <CheckBoxField label="Washed." name="washed" onBlur={onBlur} />
      </StyleProvider>
    )

    fireEvent.blur(getByLabelText('Washed.'))
    expect(onBlur).toHaveBeenCalled()
  })

  describe('when disabled', () => {
    test('should not trigger onChange event', () => {
      const onChange = jest.fn()
      const { getByLabelText } = render(
        <StyleProvider theme={cactusTheme}>
          <CheckBoxField label="Flow" name="flow" onChange={onChange} disabled />
        </StyleProvider>
      )

      userEvent.click(getByLabelText('Flow'))
      expect(onChange).not.toHaveBeenCalled()
    })

    test('should not trigger onFocus event', () => {
      const onFocus = jest.fn()
      const { getByLabelText } = render(
        <StyleProvider theme={cactusTheme}>
          <CheckBoxField label="Not For Sale" name="not_for_sale" onFocus={onFocus} disabled />
        </StyleProvider>
      )

      userEvent.click(getByLabelText('Not For Sale'))
      expect(onFocus).not.toHaveBeenCalled()
    })
  })
})
