import { generateTheme } from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextArea from './TextArea'

describe('component: TextArea', (): void => {
  test('should support margin space props', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <TextArea ml={5} data-testid="textArea" />
      </StyleProvider>
    )
    const textArea = getByTestId('textArea').parentElement
    const styles = window.getComputedStyle(textArea as HTMLElement)
    expect(styles.marginLeft).toBe('24px')
  })

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    const { getByTestId } = render(
      <StyleProvider>
        <TextArea data-testid="textArea" defaultValue="something" ref={ref} />
      </StyleProvider>
    )
    expect(getByTestId('textArea')).toBe(ref.current)
    expect(ref.current).toHaveValue('something')
  })

  test('should trigger onChange handler', (): void => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextArea onChange={onChange} placeholder="get me" />
      </StyleProvider>
    )

    userEvent.type(getByPlaceholderText('get me'), 'typing in a textarea')
    expect(onChange).toHaveBeenCalled()
  })

  describe('with theme customization', (): void => {
    test('should have 2px border', (): void => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { getByTestId } = render(
        <StyleProvider theme={theme}>
          <TextArea data-testid="textArea" />
        </StyleProvider>
      )

      const textArea = getByTestId('textArea')
      const styles = window.getComputedStyle(textArea)
      expect(styles.borderWidth).toBe('2px')
    })

    test('should have 8px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'round' })
      const { getByTestId } = render(
        <StyleProvider theme={theme}>
          <TextArea data-testid="textArea" />
        </StyleProvider>
      )

      const textArea = getByTestId('textArea')
      const styles = window.getComputedStyle(textArea)
      expect(styles.borderRadius).toBe('8px')
    })

    test('should have 0px border radius', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { getByTestId } = render(
        <StyleProvider theme={theme}>
          <TextArea data-testid="textArea" />
        </StyleProvider>
      )
      const textArea = getByTestId('textArea')
      const styles = window.getComputedStyle(textArea)
      expect(styles.borderRadius).toBe('0px')
    })
  })
})
