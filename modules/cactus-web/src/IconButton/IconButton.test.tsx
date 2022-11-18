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

    // Test the default styles while we're at it.
    expect(getByLabelText('uchiha-itachi')).toHaveStyle({
      display: 'inline-flex',
      fontSize: '24px',
      margin: '',
    })
  })

  test('should support style props', () => {
    const { getByLabelText } = renderWithTheme(
      <IconButton label="boolest" m={4} display="flex" iconSize="small">
        <StatusCheck />
      </IconButton>
    )
    expect(getByLabelText('boolest')).toHaveStyle({
      display: 'flex',
      fontSize: '16px',
      margin: '16px',
    })
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
