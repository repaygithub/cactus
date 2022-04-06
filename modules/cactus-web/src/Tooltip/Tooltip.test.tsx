import { act, fireEvent } from '@testing-library/react'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Tooltip from './Tooltip'

describe('component: Tooltip', () => {
  test('should always render label in invisible div', () => {
    const { getByTestId } = renderWithTheme(
      <Tooltip label="I'm invisible, can you see me?" id="invisible" data-testid="elbisivni" />
    )
    const label = getByTestId('elbisivni')
    expect(label).toHaveAttribute('id', 'invisible')
    expect(label).toHaveTextContent("I'm invisible, can you see me?")
  })

  test('should not render portal without mouseenter event', () => {
    renderWithTheme(<Tooltip label="This should be displayed" />)

    const portal = document.querySelector('reach-portal')

    expect(portal).toBeNull()
  })

  test('should render tooltip on hover', async () => {
    jest.useFakeTimers()
    renderWithTheme(<Tooltip label="This should be displayed" />)
    act(() => {
      fireEvent.mouseEnter(document.querySelector('span[data-reach-tooltip-trigger]') as Element)
      setTimeout(jest.fn(), 2000)
      jest.runAllTimers()
    })

    const portal = document.querySelector('reach-portal') as Element
    expect(portal).not.toBeNull()
  })

  test('should continue to render tooltip when content is hovered', async () => {
    jest.useFakeTimers()
    renderWithTheme(<Tooltip label="This should be displayed" />)
    act(() => {
      fireEvent.mouseEnter(document.querySelector('span[data-reach-tooltip-trigger]') as Element)
      setTimeout(jest.fn(), 2000)
      jest.runOnlyPendingTimers()
    })
    act(() => {
      fireEvent.mouseEnter(document.querySelector('div[role="tooltip"]') as Element)
      setTimeout(jest.fn(), 2000)
      jest.runOnlyPendingTimers()
    })
    const tooltip = document.querySelector('div[role="tooltip"]') as Element
    expect(tooltip).not.toBeNull()
  })

  test('should stay open when tooltip icon is clicked', async () => {
    jest.useFakeTimers()
    renderWithTheme(
      <>
        <Tooltip label="Show me the money" />
        <button>Something Else to Focus</button>
      </>
    )
    const tooltipTrigger = document.querySelector('span[data-reach-tooltip-trigger]') as Element
    const btn = document.querySelector('button') as Element
    act(() => {
      fireEvent.click(tooltipTrigger)
      fireEvent.mouseEnter(btn)
      setTimeout(jest.fn(), 2000)
      jest.runAllTimers()
    })
    expect(document.querySelector('div[role="tooltip"]') as Element).toBeInTheDocument()
    fireEvent.click(btn)
    expect(document.querySelector('div[role="tooltip"]') as Element).not.toBeInTheDocument()
  })
})
