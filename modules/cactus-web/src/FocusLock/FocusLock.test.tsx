import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import FocusLock from './FocusLock'

describe('component: FocusLock', () => {
  test('prevents focus from leaving the focus lock when using the keyboard', () => {
    const { getByText } = renderWithTheme(
      <>
        <FocusLock>
          <div tabIndex={0}>Focus 1</div>
          <div tabIndex={0}>Focus 2</div>
        </FocusLock>
        <div tabIndex={0}>Don't focus me</div>
      </>
    )

    const focus1 = getByText('Focus 1')
    const focus2 = getByText('Focus 2')
    const noFocus = getByText("Don't focus me")

    focus1.focus()
    userEvent.tab()
    expect(document.activeElement).toBe(focus2)
    userEvent.tab()
    expect(document.activeElement).not.toBe(noFocus)
    expect(document.activeElement).toBe(focus1)
  })
})
