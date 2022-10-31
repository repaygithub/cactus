import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Dimmer from './Dimmer'

describe('component: Dimmer', () => {
  test('should render content when active=true', () => {
    const { container } = renderWithTheme(
      <Dimmer active>
        <h2>Children is here!</h2>
      </Dimmer>
    )
    expect(container).toHaveTextContent('Children is here!')
  })

  test('should NOT render content when active=false', () => {
    const { container } = renderWithTheme(
      <Dimmer active={false}>
        <h2>Children is here!</h2>
      </Dimmer>
    )
    expect(container).not.toHaveTextContent('Children is here!')
  })

  test('should vary styles by props', () => {
    const { getByTestId } = renderWithTheme(
      <>
        <Dimmer active data-testid="fullscreen" />
        <Dimmer active data-testid="partial" position="absolute" opacity="0.5" />
      </>
    )
    expect(getByTestId('fullscreen')).toHaveStyle({
      position: 'fixed',
      backgroundColor: 'rgba(46, 53, 56, 0.9)',
    })
    expect(getByTestId('partial')).toHaveStyle({
      position: 'absolute',
      backgroundColor: 'rgba(46, 53, 56, 0.5)',
    })
  })
})
