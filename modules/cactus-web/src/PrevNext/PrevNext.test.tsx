import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import PrevNext from './PrevNext'

describe('component: PrevNext', () => {
  test('it calls the onNavigate handler when link is clicked', () => {
    const mockNavigate = jest.fn()
    const { getByText } = renderWithTheme(<PrevNext onNavigate={mockNavigate} />)

    expect(mockNavigate).not.toHaveBeenCalled()
    userEvent.click(getByText('Prev'))
    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenLastCalledWith('prev')
    userEvent.click(getByText('Next'))
    expect(mockNavigate).toHaveBeenCalledTimes(2)
    expect(mockNavigate).toHaveBeenLastCalledWith('next')
  })

  test('it calls the onNavigate handler when Enter is pressed on link focus', () => {
    const mockNavigate = jest.fn()
    renderWithTheme(<PrevNext onNavigate={mockNavigate} />)

    expect(mockNavigate).not.toHaveBeenCalled()
    userEvent.tab() // Tab to Prev
    fireEvent.keyDown(document.activeElement as Element, { key: 'Enter', keyCode: 13 })
    fireEvent.keyPress(document.activeElement as Element, { key: 'Enter', keyCode: 13 })
    fireEvent.keyUp(document.activeElement as Element, { key: 'Enter', keyCode: 13 })
    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenLastCalledWith('prev')
    userEvent.tab() // Tab to Next
    fireEvent.keyDown(document.activeElement as Element, { key: 'Enter', keyCode: 13 })
    fireEvent.keyPress(document.activeElement as Element, { key: 'Enter', keyCode: 13 })
    fireEvent.keyUp(document.activeElement as Element, { key: 'Enter', keyCode: 13 })
    expect(mockNavigate).toHaveBeenCalledTimes(2)
    expect(mockNavigate).toHaveBeenLastCalledWith('next')
  })
})
