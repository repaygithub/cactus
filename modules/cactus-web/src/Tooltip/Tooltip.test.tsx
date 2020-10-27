import { act, fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Tooltip from './Tooltip'

describe('component: Tooltip', (): void => {
  test('should render tooltip icon', (): void => {
    const { container } = render(
      <StyleProvider>
        <Tooltip label="pitloot" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a disabled tooltip', (): void => {
    const { container } = render(
      <StyleProvider>
        <Tooltip label="pitloot" disabled={true} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should not render portal without mouseenter event', (): void => {
    render(
      <StyleProvider>
        <Tooltip label="This should be displayed" />
      </StyleProvider>
    )

    const portal = document.querySelector('reach-portal')

    expect(portal).toBeNull()
  })

  test('should render tooltip on hover', async (): Promise<void> => {
    jest.useFakeTimers()
    render(
      <StyleProvider>
        <Tooltip label="This should be displayed" />
      </StyleProvider>
    )
    act((): void => {
      fireEvent.mouseEnter(document.querySelector('span') as Element)
      setTimeout(jest.fn(), 2000)
      jest.runAllTimers()
    })

    const portal = document.querySelector('reach-portal') as Element
    expect(portal).not.toBeNull()
    expect(portal.firstChild).toMatchSnapshot()
  })
})
