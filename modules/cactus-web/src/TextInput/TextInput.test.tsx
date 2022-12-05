import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import TextInput from './TextInput'

describe('component: TextInput', () => {
  test('should render an input with a placeholder', () => {
    const { getByPlaceholderText } = renderWithTheme(<TextInput placeholder="hold my place" />)

    expect(getByPlaceholderText('hold my place')).toBeInTheDocument()
  })

  test('should support margin space props', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput marginTop={4} placeholder="Do I wanna know?" />
    )

    const textInput = getByPlaceholderText('Do I wanna know?')
    const styles = window.getComputedStyle(textInput)

    expect(styles.marginTop).toBe('16px')
  })

  test('should supoport flex item props', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        placeholder="Are there some aces up your sleeve?"
        flexBasis="10%"
        flexGrow={3}
        flexShrink={1}
      />
    )

    const inputEl = getByPlaceholderText('Are there some aces up your sleeve?')
    const styles = window.getComputedStyle(inputEl)

    expect(styles.flexBasis).toBe('10%')
    expect(styles.flexGrow).toBe('3')
    expect(styles.flexShrink).toBe('1')
  })

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByTestId } = renderWithTheme(
      <TextInput data-testid="with-ref" defaultValue="sentinel" ref={ref} />
    )
    expect(getByTestId('with-ref')).toBe(ref.current)
    expect(ref.current).toHaveValue('sentinel')
  })

  test('should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput placeholder="get this" onChange={onChange} />
    )

    userEvent.type(getByPlaceholderText('get this'), 'typing...')
    expect(onChange).toHaveBeenCalled()
  })

  describe('with theme customization', () => {
    test('should have 2px border', () => {
      const { getByPlaceholderText } = renderWithTheme(
        <TextInput placeholder="Do I wanna know?" />,
        { border: 'thick' }
      )

      const textInput = getByPlaceholderText('Do I wanna know?')
      const styles = window.getComputedStyle(textInput)

      expect(styles.borderWidth).toBe('2px')
    })

    test('should have 8px border radius', () => {
      const { getByPlaceholderText } = renderWithTheme(
        <TextInput placeholder="Do I wanna know?" />,
        { shape: 'intermediate' }
      )

      const textInput = getByPlaceholderText('Do I wanna know?')
      const styles = window.getComputedStyle(textInput)

      expect(styles.borderRadius).toBe('8px')
    })

    test('should have 0px border radius', () => {
      const { getByPlaceholderText } = renderWithTheme(
        <TextInput placeholder="Do I wanna know?" />,
        { shape: 'square' }
      )

      const textInput = getByPlaceholderText('Do I wanna know?')
      const styles = window.getComputedStyle(textInput)

      expect(styles.borderRadius).toBe('0px')
    })
  })
})
