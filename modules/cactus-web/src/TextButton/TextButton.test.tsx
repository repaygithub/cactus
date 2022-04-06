import { StatusCheck } from '@repay/cactus-icons'
import { fireEvent } from '@testing-library/react'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import TextButton from './TextButton'

describe('component: TextButton', () => {
  test('should support space props', () => {
    const { getByText } = renderWithTheme(<TextButton marginRight={5}>I have margins!</TextButton>)
    const textButton = getByText('I have margins!')
    const styles = window.getComputedStyle(textButton)

    expect(styles.marginRight).toBe('24px')
  })

  test('should trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = renderWithTheme(
      <TextButton onClick={onClick} data-testid="clicked">
        Click me!
      </TextButton>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = renderWithTheme(
      <TextButton disabled onClick={onClick} data-testid="not-clicked">
        Click me!
      </TextButton>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })

  test('should render a text+icon button', () => {
    const { getByText } = renderWithTheme(
      <TextButton>
        <StatusCheck />
        Check check
      </TextButton>
    )
    const svgElement = getByText('Check check').children
    expect(svgElement[0].tagName).toBe('svg')
  })
})
