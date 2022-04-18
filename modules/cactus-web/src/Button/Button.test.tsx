import { ActionsDelete } from '@repay/cactus-icons'
import { fireEvent } from '@testing-library/react'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Button from './Button'

describe('component: Button', () => {
  test('should support margin space props', () => {
    const { getByText } = renderWithTheme(<Button mt={5}>I have margins!</Button>)
    const button = getByText('I have margins!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)

    expect(styled.marginTop).toBe('24px')
  })

  test('should support svgs as children', () => {
    renderWithTheme(
      <Button>
        <ActionsDelete /> Delete
      </Button>
    )
  })

  test('should render Spinner when loading is true', () => {
    const { getByLabelText } = renderWithTheme(<Button loading>Submit</Button>)
    expect(getByLabelText('loading')).toBeInTheDocument()
  })

  test('should trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = renderWithTheme(
      <Button onClick={onClick} variant="action" data-testid="clicked">
        Click me!
      </Button>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger disabled onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = renderWithTheme(
      <Button onClick={onClick} variant="action" disabled data-testid="not-clicked">
        Click me!
      </Button>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })
  test('aria-live prop default and custom', () => {
    const { getByText, rerender } = renderWithTheme(<Button>Click me!</Button>)
    const button = getByText('Click me!').parentElement

    //aria-live should be assertive by default
    expect(button?.getAttribute('aria-live')).toBe('assertive')

    rerender(<Button aria-live="polite">Click me!</Button>)

    expect(button?.getAttribute('aria-live')).toBe('polite')
  })
})

describe('With theme changes ', () => {
  test('should have 2px border', () => {
    const { getByText } = renderWithTheme(<Button>Click me!</Button>, { border: 'thick' })
    const button = getByText('Click me!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)
    expect(styled.borderWidth).toBe('2px')
  })

  test('Should have intermediate border radius', () => {
    const { getByText } = renderWithTheme(<Button>Click me!</Button>, { shape: 'intermediate' })

    const button = getByText('Click me!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)
    expect(styled.borderRadius).toBe('8px')
  })

  test('Should have square border radius', () => {
    const { getByText } = renderWithTheme(<Button>Click me!</Button>, { shape: 'square' })

    const button = getByText('Click me!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)
    expect(styled.borderRadius).toBe('1px')
  })

  test('Should not have box shadows applied', () => {
    const { getByText } = renderWithTheme(<Button>Click me!</Button>, { boxShadows: false })
    const button = getByText('Click me!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)
    expect(styled.boxShadow).toBe('')
  })
})
