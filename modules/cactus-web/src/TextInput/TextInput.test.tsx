import { generateTheme } from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextInput from './TextInput'

describe('component: TextInput', (): void => {
  test('should render an input with a placeholder', (): void => {
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextInput placeholder="hold my place" />
      </StyleProvider>
    )

    expect(getByPlaceholderText('hold my place')).toBeInTheDocument()
  })

  test('should support margin space props', (): void => {
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextInput marginTop={4} placeholder="Do I wanna know?" />
      </StyleProvider>
    )

    const textInput = getByPlaceholderText('Do I wanna know?').parentElement
    const styles = window.getComputedStyle(textInput as HTMLElement)

    expect(styles.marginTop).toBe('16px')
  })

  test('should trigger onChange handler', (): void => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextInput placeholder="get this" onChange={onChange} />
      </StyleProvider>
    )

    userEvent.type(getByPlaceholderText('get this'), 'typing...')
    expect(onChange).toHaveBeenCalled()
  })

  describe('with theme customization', (): void => {
    test('should have 2px border', (): void => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { getByPlaceholderText } = render(
        <StyleProvider theme={theme}>
          <TextInput placeholder="Do I wanna know?" />
        </StyleProvider>
      )

      const textInput = getByPlaceholderText('Do I wanna know?')
      const styles = window.getComputedStyle(textInput)

      expect(styles.borderWidth).toBe('2px')
    })

    test('should have 8px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { getByPlaceholderText } = render(
        <StyleProvider theme={theme}>
          <TextInput placeholder="Do I wanna know?" />
        </StyleProvider>
      )

      const textInput = getByPlaceholderText('Do I wanna know?')
      const styles = window.getComputedStyle(textInput)

      expect(styles.borderRadius).toBe('8px')
    })

    test('should have 1px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { getByPlaceholderText } = render(
        <StyleProvider theme={theme}>
          <TextInput placeholder="Do I wanna know?" />
        </StyleProvider>
      )

      const textInput = getByPlaceholderText('Do I wanna know?')
      const styles = window.getComputedStyle(textInput)

      expect(styles.borderRadius).toBe('1px')
    })
  })
})
