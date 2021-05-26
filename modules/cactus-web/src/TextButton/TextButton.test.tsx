import { StatusCheck } from '@repay/cactus-icons'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextButton from './TextButton'

describe('component: TextButton', (): void => {
  test('should support space props', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <TextButton marginRight={5}>I have margins!</TextButton>
      </StyleProvider>
    )
    const textButton = getByText('I have margins!')
    const styles = window.getComputedStyle(textButton)

    expect(styles.marginRight).toBe('24px')
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
    const { getByText } = render(
      <StyleProvider>
        <TextButton>
          <StatusCheck />
          Check check
        </TextButton>
      </StyleProvider>
    )
    const svgElement = getByText('Check check').children
    expect(svgElement[0].tagName).toBe('svg')
  })
})
