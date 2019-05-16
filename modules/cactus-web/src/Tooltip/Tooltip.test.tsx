import * as React from 'react'

import { act, cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Tooltip from './Tooltip'

afterEach(cleanup)

describe('component: Tooltip', () => {
  test('should render tooltip icon', () => {
    const { container } = render(
      <StyleProvider>
        <Tooltip label="pitloot" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should not render portal without mouseenter event', () => {
    render(
      <StyleProvider>
        <Tooltip label="This should be displayed" />
      </StyleProvider>
    )

    const portal = document.querySelector('reach-portal')

    expect(portal).toBeNull()
  })

  test('should render tooltip on hover', async () => {
    jest.useFakeTimers()
    render(
      <StyleProvider>
        <Tooltip label="This should be displayed" />
      </StyleProvider>
    )
    act(() => {
      fireEvent.mouseEnter(document.querySelector('span') as Element)
      setTimeout(jest.fn(), 2000)
      jest.runAllTimers()
    })

    const portal = document.querySelector('reach-portal') as Element
    expect(portal).not.toBeNull()
    expect(portal.firstChild).toMatchSnapshot()
  })
})
