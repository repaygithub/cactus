import * as React from 'react'

import { cleanup, fireEvent, render } from 'react-testing-library'
import { StatusCheck } from '@repay/cactus-icons'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'
import IconButton from './IconButton'

afterEach(cleanup)

describe('component: IconButton', () => {
  test('should default to standard medium icon button', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton>
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render standard medium icon button', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton iconSize="medium">
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render tiny icon button', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton iconSize="tiny">
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render small icon button', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton iconSize="small">
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render large icon button', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton iconSize="large">
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render call to action icon button', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton variant="action">
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse standard icon button', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton variant="standard" inverse>
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse call to action icon button', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton variant="action" inverse>
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render icon button with aria-label', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton label="uchiha-itachi">
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render disabled variant', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton disabled>
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse disabled variant', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton inverse disabled>
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const iconButton = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton mb={3}>
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton onClick={onClick} data-testid="clicked">
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <ThemeProvider theme={cactusTheme}>
        <IconButton disabled onClick={onClick} data-testid="not-clicked">
          <StatusCheck />
        </IconButton>
      </ThemeProvider>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
