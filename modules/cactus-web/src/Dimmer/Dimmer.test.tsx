import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Dimmer from './Dimmer'

describe('Dimmer render content as children', () => {
  test('Page Dimmer: Should render content when active=true', () => {
    const { container } = renderWithTheme(
      <Dimmer active>
        <h2>Children is here!</h2>
      </Dimmer>
    )
    expect(container).toHaveTextContent('Children is here!')
  })

  test('Page Dimmer: Should NOT render content when active=false', () => {
    const { container } = renderWithTheme(
      <Dimmer active={false}>
        <h2>Children is here!</h2>
      </Dimmer>
    )
    expect(container).not.toHaveTextContent('Children is here!')
  })

  test('Dimmer should blur elements that have focus when it becomes active', () => {
    const buttonBlur = jest.fn()
    const { getByText, rerender } = renderWithTheme(
      <>
        <button onBlur={buttonBlur}>I should be blurred</button>
        <Dimmer active={false} />
      </>
    )

    const button = getByText('I should be blurred')
    button.focus()
    expect(document.activeElement).toBe(button)

    rerender(
      <>
        <button onBlur={buttonBlur}>I should be blurred</button>
        <Dimmer active />
      </>
    )

    expect(document.activeElement).not.toBe(button)
    expect(buttonBlur).toHaveBeenCalled()
  })
})
