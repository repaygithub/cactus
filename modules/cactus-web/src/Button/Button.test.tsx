import * as React from 'react'

import { ActionsDelete } from '@repay/cactus-icons'
import { cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Button from './Button'
import cactusTheme from '@repay/cactus-theme'

afterEach(cleanup)

describe('component: Button', () => {
  test('should default to standard variant', () => {
    const button = render(
      <StyleProvider>
        <Button>Click me!</Button>
      </StyleProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render standard variant', () => {
    const button = render(
      <StyleProvider>
        <Button variant="standard">Click me!</Button>
      </StyleProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render call to action variant', () => {
    const button = render(
      <StyleProvider>
        <Button variant="action">Click me!</Button>
      </StyleProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render disabled variant', () => {
    const button = render(
      <StyleProvider>
        <Button disabled>Click me!</Button>
      </StyleProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render inverse standard variant', () => {
    const button = render(
      <StyleProvider>
        <Button variant="standard" inverse>
          Click me!
        </Button>
      </StyleProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render inverse call to action variant', () => {
    const button = render(
      <StyleProvider>
        <Button variant="action" inverse>
          Click me!
        </Button>
      </StyleProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should render inverse disabled variant', () => {
    const button = render(
      <StyleProvider>
        <Button disabled inverse>
          }>Click me!
        </Button>
      </StyleProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const button = render(
      <StyleProvider>
        <Button mt={5}>I have margins!</Button>
      </StyleProvider>
    )

    expect(button.asFragment()).toMatchSnapshot()
  })

  test('should support svgs as children', () => {
    const button = render(
      <StyleProvider>
        <Button>
          <ActionsDelete /> Delete
        </Button>
      </StyleProvider>
    )
  })

  test('should render Spinner when loading is true', () => {
    const { asFragment } = render(
      <ThemeProvider theme={cactusTheme}>
        <Button loading>Submit</Button>
      </ThemeProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test('should trigger onClick', () => {
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

  test('should not trigger disabled onClick', () => {
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
