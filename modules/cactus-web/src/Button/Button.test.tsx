import { ActionsDelete } from '@repay/cactus-icons'
import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Button from './Button'

describe('component: Button', (): void => {
  test('should support margin space props', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Button mt={5}>I have margins!</Button>
      </StyleProvider>
    )
    const button = getByText('I have margins!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)

    expect(styled.marginTop).toBe('24px')
  })

  test('should support svgs as children', (): void => {
    render(
      <StyleProvider>
        <Button>
          <ActionsDelete /> Delete
        </Button>
      </StyleProvider>
    )
  })

  test('should render Spinner when loading is true', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <Button loading>Submit</Button>
      </StyleProvider>
    )
    expect(getByLabelText('loading')).toBeInTheDocument()
  })

  test('should trigger onClick', (): void => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <Button onClick={onClick} variant="action" data-testid="clicked">
          Click me!
        </Button>
      </StyleProvider>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger disabled onClick', (): void => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <Button onClick={onClick} variant="action" disabled data-testid="not-clicked">
          Click me!
        </Button>
      </StyleProvider>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('With theme changes ', (): void => {
  test('should have 2px border', (): void => {
    const theme = generateTheme({ primaryHue: 200, border: 'thick' })
    const { getByText } = render(
      <StyleProvider theme={theme}>
        <Button>Click me!</Button>
      </StyleProvider>
    )
    const button = getByText('Click me!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)
    expect(styled.borderWidth).toBe('2px')
  })

  test('Should have intermediate border radius', (): void => {
    const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
    const { getByText } = render(
      <StyleProvider theme={theme}>
        <Button>Click me!</Button>
      </StyleProvider>
    )

    const button = getByText('Click me!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)
    expect(styled.borderRadius).toBe('8px')
  })

  test('Should have square border radius', (): void => {
    const theme = generateTheme({ primaryHue: 200, shape: 'square' })
    const { getByText } = render(
      <StyleProvider theme={theme}>
        <Button>Click me!</Button>
      </StyleProvider>
    )

    const button = getByText('Click me!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)
    expect(styled.borderRadius).toBe('1px')
  })

  test('Should not have box shadows applied', (): void => {
    const theme = generateTheme({ primaryHue: 200, boxShadows: false })
    const { getByText } = render(
      <StyleProvider theme={theme}>
        <Button>Click me!</Button>
      </StyleProvider>
    )
    const button = getByText('Click me!').parentElement
    const styled = window.getComputedStyle(button as HTMLElement)
    expect(styled.boxShadow).toBe('')
  })
})
