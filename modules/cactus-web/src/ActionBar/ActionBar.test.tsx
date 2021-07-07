import { ActionsGear, ActionsKey } from '@repay/cactus-icons'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import ActionBar from './ActionBar'
import ActionProvider from './ActionProvider'

describe('component: ActionBar', () => {
  test('typechecks', () => {
    const itemRef: React.MutableRefObject<HTMLButtonElement | null> = { current: null }
    const panelRef: React.MutableRefObject<HTMLDivElement | null> = { current: null }
    const { getByLabelText, getByTestId } = render(
      <StyleProvider>
        <ActionBar data-testid="bar">
          <ActionBar.Panel
            id="one"
            icon={<ActionsGear />}
            ref={panelRef}
            aria-label="The Panel"
            data-testid="panel"
          >
            <p>I am a helpful message of some sort.</p>
          </ActionBar.Panel>
          <ActionBar.Item
            id="two"
            icon={<ActionsKey />}
            ref={itemRef}
            aria-label="The Button"
            data-testid="item"
          />
        </ActionBar>
      </StyleProvider>
    )

    expect(getByTestId('panel')).toBe(panelRef.current)
    expect(getByLabelText('The Panel')).toBe(panelRef.current?.firstElementChild)
    expect(getByTestId('item')).toBe(itemRef.current)
    expect(getByLabelText('The Button')).toBe(itemRef.current)
    const actionbar = getByTestId('bar')
    expect(actionbar?.contains(panelRef.current)).toBe(true)
    expect(actionbar?.contains(itemRef.current)).toBe(true)
  })

  test('reposition buttons', () => {
    const { getByLabelText } = render(
      <StyleProvider>
        <ActionProvider>
          <ActionBar aria-label="Bar of Actions">
            <ActionBar.Item id="high" aria-label="Gear" icon={<ActionsGear />} orderHint="high" />
          </ActionBar>
          <div aria-label="Content">
            <ActionBar.Item id="bottom" aria-label="Key" icon={<ActionsKey />} orderHint="bottom" />
            <ActionBar.Panel id="normal" aria-label="Key2" icon={<ActionsKey />} />
            <ActionBar.Item id="top" aria-label="top" icon={<ActionsKey />} orderHint="top" />
          </div>
        </ActionProvider>
      </StyleProvider>
    )
    const actionBar = getByLabelText('Bar of Actions')
    expect(actionBar.children).toHaveLength(4)
    expect(actionBar.children[0]).toHaveAttribute('aria-label', 'top')
    expect(actionBar.children[1]).toHaveAttribute('id', 'high')
    expect(actionBar.children[2]).toHaveAttribute('id', 'normal')
    expect(actionBar.children[3]).toHaveAttribute('id', 'bottom')
    const content = getByLabelText('Content')
    expect(content.children).toHaveLength(0)
  })

  test('panel control', async () => {
    const panelRef: React.MutableRefObject<HTMLDivElement | null> = { current: null }
    const outsideRef: React.MutableRefObject<HTMLButtonElement | null> = { current: null }
    const { getByLabelText } = render(
      <StyleProvider>
        <button ref={outsideRef}>Outside</button>
        <ActionBar>
          <ActionBar.Panel id="one" icon={<ActionsGear />} ref={panelRef} aria-label="The Panel">
            {(toggle, expanded) => (
              <>
                <label>
                  Setting
                  <input
                    name="setting"
                    type="checkbox"
                    checked={expanded}
                    onChange={() => toggle()}
                  />
                </label>
              </>
            )}
          </ActionBar.Panel>
        </ActionBar>
      </StyleProvider>
    )
    const button = getByLabelText('The Panel')
    const panel = panelRef.current?.lastElementChild as HTMLElement
    const checkbox = getByLabelText('Setting') as HTMLInputElement

    expect(button).toHaveAttribute('aria-controls', panel.id)
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    expect(button).not.toHaveAttribute('aria-expanded')
    expect(panel).toHaveAttribute('role', 'dialog')
    expect(panel).toHaveAttribute('aria-labelledby', button.id)
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(checkbox.checked).toBe(false)

    // Show by clicking the button
    userEvent.click(button)
    await waitFor(() => expect(checkbox).toHaveFocus())
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('aria-hidden')
    expect(checkbox.checked).toBe(true)

    // Hide by pressing escape
    userEvent.type(checkbox, '{esc}', { skipClick: true })
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(button).toHaveFocus()

    // Show by pressing enter
    userEvent.type(button, '{enter}', { skipClick: true })
    expect(panel).not.toHaveAttribute('aria-hidden')
    expect(checkbox).toHaveFocus()

    // Hide by clicking outside popup
    userEvent.click(outsideRef.current as HTMLElement)
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(outsideRef.current).toHaveFocus()

    // Show by pressing space
    userEvent.tab()
    userEvent.type(button, '{space}', { skipClick: true })
    expect(panel).not.toHaveAttribute('aria-hidden')
    expect(checkbox).toHaveFocus()

    // Hide by toggling checkbox
    userEvent.click(checkbox)
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })
})
