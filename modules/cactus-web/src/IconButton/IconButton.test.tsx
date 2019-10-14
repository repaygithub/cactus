import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { StatusCheck } from '@repay/cactus-icons'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import cactusTheme from '@repay/cactus-theme'
import IconButton from './IconButton'

afterEach(cleanup)

describe('component: IconButton', () => {
  test('should default to standard medium icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render standard medium icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" iconSize="medium">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render tiny icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" iconSize="tiny">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render small icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" iconSize="small">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render large icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" iconSize="large">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render call to action icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" variant="action">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render danger icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" variant="danger">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse standard icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" variant="standard" inverse>
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse call to action icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" variant="action" inverse>
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse danger icon button', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" variant="danger" inverse>
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render icon button with aria-label', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="uchiha-itachi">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render disabled variant', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" disabled>
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should render inverse disabled variant', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" inverse disabled>
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const iconButton = render(
      <StyleProvider>
        <IconButton label="boolest" mb={4}>
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(iconButton.asFragment()).toMatchSnapshot()
  })

  test('should trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <IconButton label="boolest" onClick={onClick} data-testid="clicked">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = render(
      <StyleProvider>
        <IconButton label="boolest" disabled onClick={onClick} data-testid="not-clicked">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
