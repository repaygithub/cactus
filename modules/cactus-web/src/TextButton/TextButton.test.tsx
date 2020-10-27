import { StatusCheck } from '@repay/cactus-icons'
import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextButton from './TextButton'

describe('component: TextButton', (): void => {
  test('should default to standard variant', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton>Click me!</TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render standard variant', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton variant="standard">Click me!</TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render call to action variant', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton variant="action">Click me!</TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render danger variant', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton variant="danger">Click me!</TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render disabled variant', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton disabled>Click me!</TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse standard variant', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton variant="standard" inverse>
          Click me!
        </TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse call to action variant', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton variant="action" inverse>
          Click me!
        </TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse disabled variant', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton variant="standard" inverse disabled>
          Click me!
        </TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should support space props', (): void => {
    const textButton = render(
      <StyleProvider>
        <TextButton marginRight={5}>I have margins!</TextButton>
      </StyleProvider>
    )

    expect(textButton.asFragment()).toMatchSnapshot()
  })

  test('should trigger onClick', (): void => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <TextButton onClick={onClick} data-testid="clicked">
          Click me!
        </TextButton>
      </StyleProvider>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick', (): void => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <TextButton disabled onClick={onClick} data-testid="not-clicked">
          Click me!
        </TextButton>
      </StyleProvider>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })

  test('should render a text+icon button', (): void => {
    const textIconButton = render(
      <StyleProvider>
        <TextButton>
          <StatusCheck />
          Check check
        </TextButton>
      </StyleProvider>
    )

    expect(textIconButton.asFragment()).toMatchSnapshot()
  })

  test('should render a disabled text+icon button', (): void => {
    const textIconButton = render(
      <StyleProvider>
        <TextButton>
          <StatusCheck />
          Check check
        </TextButton>
      </StyleProvider>
    )

    expect(textIconButton.asFragment()).toMatchSnapshot()
  })
})

describe('With theme changes ', (): void => {
  test('Should have 2px border', (): void => {
    const theme = generateTheme({ primaryHue: 200, border: 'thick' })
    const { asFragment } = render(
      <StyleProvider theme={theme}>
        <TextButton>Click me!</TextButton>
      </StyleProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test('Should have square shape', (): void => {
    const theme = generateTheme({ primaryHue: 200, shape: 'square' })
    const { asFragment } = render(
      <StyleProvider theme={theme}>
        <TextButton>Click me!</TextButton>
      </StyleProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
  test('Should have intermediate shape', (): void => {
    const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
    const { asFragment } = render(
      <StyleProvider theme={theme}>
        <TextButton>Click me!</TextButton>
      </StyleProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
