import { StatusCheck } from '@repay/cactus-icons'
import { fireEvent } from '@testing-library/react'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import IconButton from './IconButton'

describe('component: IconButton', () => {
  test('should render icon button with aria-label', () => {
    const { getByLabelText } = renderWithTheme(
      <IconButton label="uchiha-itachi">
        <StatusCheck />
      </IconButton>
    )

    expect(getByLabelText('uchiha-itachi')).toBeInTheDocument()
  })
  test('should support margin space props', () => {
    const { getByLabelText } = renderWithTheme(
      <IconButton label="boolest" mb={4}>
        <StatusCheck />
      </IconButton>
    )
    const iconButton = getByLabelText('boolest')
    const styles = window.getComputedStyle(iconButton)
    expect(styles.marginBottom).toBe('16px')
  })

  test('should trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = renderWithTheme(
      <IconButton label="boolest" onClick={onClick} data-testid="clicked">
        <StatusCheck />
      </IconButton>
    )

    fireEvent.click(getByTestId('clicked'))
    expect(onClick).toHaveBeenCalled()
  })

  test('should not trigger onClick', () => {
    const onClick = jest.fn()
    const { getByTestId } = renderWithTheme(
      <IconButton label="boolest" disabled onClick={onClick} data-testid="not-clicked">
        <StatusCheck />
      </IconButton>
    )

    fireEvent.click(getByTestId('not-clicked'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
