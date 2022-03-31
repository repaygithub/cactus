import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import TextArea from './TextArea'

describe('component: TextArea', () => {
  test('Should support margin space props', () => {
    const { getByTestId } = renderWithTheme(<TextArea ml={5} data-testid="textArea" />)
    const textArea = getByTestId('textArea').parentElement
    const styles = window.getComputedStyle(textArea as HTMLElement)
    expect(styles.marginLeft).toBe('24px')
  })

  test('Should support ref prop', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    const { getByTestId } = renderWithTheme(
      <TextArea data-testid="textArea" defaultValue="something" ref={ref} />
    )
    expect(getByTestId('textArea')).toBe(ref.current)
    expect(ref.current).toHaveValue('something')
  })

  test('Should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = renderWithTheme(
      <TextArea onChange={onChange} placeholder="get me" />
    )

    userEvent.type(getByPlaceholderText('get me'), 'typing in a textarea')
    expect(onChange).toHaveBeenCalled()
  })

  describe('with theme customization', () => {
    test('Should have 2px border', () => {
      const { getByTestId } = renderWithTheme(<TextArea data-testid="textArea" />, {
        border: 'thick',
      })

      const textArea = getByTestId('textArea')
      const styles = window.getComputedStyle(textArea)
      expect(styles.borderWidth).toBe('2px')
    })

    test('Should have 8px border radius', () => {
      const { getByTestId } = renderWithTheme(<TextArea data-testid="textArea" />, {
        shape: 'round',
      })

      const textArea = getByTestId('textArea')
      const styles = window.getComputedStyle(textArea)
      expect(styles.borderRadius).toBe('8px')
    })

    test('Should have 0px border radius', () => {
      const { getByTestId } = renderWithTheme(<TextArea data-testid="textArea" />, {
        shape: 'square',
      })
      const textArea = getByTestId('textArea')
      const styles = window.getComputedStyle(textArea)
      expect(styles.borderRadius).toBe('0px')
    })
  })
})
