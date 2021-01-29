import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Dimmer from './Dimmer'

describe('Dimmer when page=true', () => {
  test('Snapshot Page Dimmer ', () => {
    const { baseElement } = render(
      <StyleProvider>
        <Dimmer active page></Dimmer>
      </StyleProvider>
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('Dimmer when page=false', () => {
  test('Snapshot Content Dimmer', () => {
    const { baseElement } = render(
      <StyleProvider>
        <Dimmer.DimmableContent>
          <Dimmer active></Dimmer>
        </Dimmer.DimmableContent>
      </StyleProvider>
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('Dimmer render content as children', () => {
  test('Page Dimmer: Should render content when active=true', () => {
    const { container } = render(
      <StyleProvider>
        <Dimmer active page>
          <h2>Children is here!</h2>
        </Dimmer>
      </StyleProvider>
    )
    expect(container).toHaveTextContent('Children is here!')
  })
  test('Page Dimmer: Should NOT render content when active=true', () => {
    const { container } = render(
      <StyleProvider>
        <Dimmer active={false} page>
          <h2>Children is here!</h2>
        </Dimmer>
      </StyleProvider>
    )
    expect(container).not.toHaveTextContent('Children is here!')
  })
  test('Content Dimmer: Should render content when active=true', () => {
    const { container } = render(
      <StyleProvider>
        <Dimmer.DimmableContent>
          <Dimmer active>
            <h2>Children is here!</h2>
          </Dimmer>
        </Dimmer.DimmableContent>
      </StyleProvider>
    )
    expect(container).toHaveTextContent('Children is here!')
  })
  test('Content Dimmer: Should NOT render content when active=true', () => {
    const { container } = render(
      <StyleProvider>
        <Dimmer.DimmableContent>
          <Dimmer active={false}>
            <h2>Children is here!</h2>
          </Dimmer>
        </Dimmer.DimmableContent>
      </StyleProvider>
    )
    expect(container).not.toHaveTextContent('Children is here!')
  })
})
