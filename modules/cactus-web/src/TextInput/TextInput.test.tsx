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

    const textInput = getByPlaceholderText('Do I wanna know?').parentElement
    const styles = window.getComputedStyle(textInput as HTMLElement)

    expect(styles.marginTop).toBe('16px')
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
