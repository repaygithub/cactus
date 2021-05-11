import { StatusCheck } from '@repay/cactus-icons'
import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import IconButton from './IconButton'

describe('component: IconButton', (): void => {
  test('should render icon button with aria-label', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <IconButton label="uchiha-itachi">
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )

    expect(getByLabelText('uchiha-itachi')).toBeInTheDocument()
  })
  test('should support margin space props', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <IconButton label="boolest" mb={4}>
          <StatusCheck />
        </IconButton>
      </StyleProvider>
    )
    const iconButton = getByLabelText('boolest')
    const styles = window.getComputedStyle(iconButton)
    expect(styles.marginBottom).toBe('16px')
  })

  test('should trigger onClick', (): void => {
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

  test('should not trigger onClick', (): void => {
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
