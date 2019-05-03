import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import userEvent from 'user-event'
import ToggleField from './ToggleField'
import cactusTheme from '@repay/cactus-theme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: ToggleField', () => {
  test('snapshot', () => {
    const { container } = render(
      <ThemeProvider theme={cactusTheme}>
        <ToggleField id="static-id" name="is_enabled" label="Enabled" value={false} />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('snapshot when value=true', () => {
    const { container } = render(
      <ThemeProvider theme={cactusTheme}>
        <ToggleField id="static-id" name="is_enabled" label="Enabled" value={true} />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('snapshot when disabled', () => {
    const { container } = render(
      <ThemeProvider theme={cactusTheme}>
        <ToggleField id="static-id" name="is_enabled" label="Enabled" value={false} disabled />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should generate unique id when one is not provided', () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <ToggleField label="Show me the money" name="show-me-the-money" value={true} />
      </ThemeProvider>
    )

    expect(getByLabelText('Show me the money').id).toContain('show-me-the-money')
  })

  test('should trigger onChange event with next value', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <ToggleField
          label="Show me the money"
          name="show-me-the-money"
          value={true}
          onChange={onChange}
        />
      </ThemeProvider>
    )

    fireEvent.click(getByLabelText('Show me the money'))
    expect(onChange).toHaveBeenCalledWith('show-me-the-money', false)
  })

  test('should trigger onFocus event', () => {
    const onFocus = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <ToggleField label="Strange Nights" name="strange_nights" value={false} onFocus={onFocus} />
      </ThemeProvider>
    )

    fireEvent.focus(getByLabelText('Strange Nights'))
    expect(onFocus).toHaveBeenCalled()
  })

  test('should trigger onBlur event', () => {
    const onBlur = jest.fn()
    const { getByLabelText } = render(
      <ThemeProvider theme={cactusTheme}>
        <ToggleField label="Washed." name="washed" value={false} onBlur={onBlur} />
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
          <ToggleField label="Flow" name="flow" value={false} onChange={onChange} disabled />
        </ThemeProvider>
      )

      userEvent.click(getByLabelText('Flow'))
      expect(onChange).not.toHaveBeenCalled()
    })

    test('should not trigger onFocus event', () => {
      const onFocus = jest.fn()
      const { getByLabelText } = render(
        <ThemeProvider theme={cactusTheme}>
          <ToggleField
            label="Not For Sale"
            name="not_for_sale"
            value={true}
            onFocus={onFocus}
            disabled
          />
        </ThemeProvider>
      )

      userEvent.click(getByLabelText('Not For Sale'))
      expect(onFocus).not.toHaveBeenCalled()
    })
  })
})
