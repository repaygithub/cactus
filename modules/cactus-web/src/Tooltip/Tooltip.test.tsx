import { act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  test('should render tooltip on hover', async () => {
    jest.useFakeTimers()
    renderWithTheme(<Tooltip label="This should be displayed" />)
    const popup = document.querySelector('div[data-tooltip-popup]')
    expect(popup?.getAttribute('aria-hidden')).toBe('true')
    act(() => {
      fireEvent.mouseEnter(document.querySelector('span') as Element)
      jest.runAllTimers()
    })
    expect(popup?.getAttribute('aria-hidden')).toBe('false')
  })

  test('should continue to render tooltip when content is hovered', async () => {
    jest.useFakeTimers()
    renderWithTheme(<Tooltip label="This should be displayed" />)
    const popup = document.querySelector('div[data-tooltip-popup]') as Element
    act(() => {
      fireEvent.mouseEnter(document.querySelector('span') as Element)
      setTimeout(jest.fn(), 2000)
      jest.runOnlyPendingTimers()
    })
    act(() => {
      fireEvent.mouseEnter(popup)
      setTimeout(jest.fn(), 2000)
      jest.runOnlyPendingTimers()
    })
    expect(popup.getAttribute('aria-hidden')).toBe('false')
  })

  test('should stay open when tooltip icon is clicked', async () => {
    jest.useFakeTimers()
    renderWithTheme(
      <>
        <Tooltip label="Show me the money" />
        <button>Something Else to Focus</button>
      </>
    )
    const tooltipTrigger = document.querySelector('span') as Element
    const btn = document.querySelector('button') as Element
    const popup = document.querySelector('div[data-tooltip-popup]') as Element
    act(() => {
      userEvent.click(tooltipTrigger)
      fireEvent.mouseEnter(btn)
      setTimeout(jest.fn(), 2000)
      jest.runAllTimers()
    })
    expect(popup.getAttribute('aria-hidden')).toBe('false')
    fireEvent.click(btn)
    expect(popup.getAttribute('aria-hidden')).toBe('true')
  })

  test('should support custom position function', async () => {
    jest.useFakeTimers()
    renderWithTheme(
      <Tooltip
        label="Custom Position"
        position={() => ({ top: 25, left: '150px', borderRadius: 0 })}
      />
    )
    act(() => {
      fireEvent.mouseEnter(document.querySelector('span') as Element)
      jest.runAllTimers()
    })
    const popup = document.querySelector('div[data-tooltip-popup]') as Element
    expect(popup).toHaveStyle({ top: '25px', left: '150px', borderRadius: '0px' })
  })
})
