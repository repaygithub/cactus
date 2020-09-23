import { ActionsGear, ActionsKey } from '@repay/cactus-icons'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import ActionBar from './ActionBar'
import ActionProvider from './ActionProvider'

describe('component: ActionBar', () => {
  test('typechecks', () => {
    const itemRef: React.MutableRefObject<HTMLButtonElement | null> = { current: null }
    const panelRef: React.MutableRefObject<HTMLDivElement | null> = { current: null }
    const { container, getByLabelText } = render(
      <StyleProvider>
        <ActionBar>
          <ActionBar.Panel id="one" icon={<ActionsGear />} ref={panelRef} aria-label="The Panel">
            <p>I am a helpful message of some sort.</p>
          </ActionBar.Panel>
          <ActionBar.Item id="two" icon={<ActionsKey />} ref={itemRef} aria-label="The Button" />
        </ActionBar>
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
    expect(getByLabelText('The Panel')).toBe(panelRef.current?.firstElementChild)
    expect(getByLabelText('The Button')).toBe(itemRef.current)
  })

  test('reposition buttons', () => {
    const { getByLabelText } = render(
      <StyleProvider>
        <ActionProvider>
          <ActionBar aria-label="Bar of Actions">
            <ActionBar.Item id="high" icon={<ActionsGear />} orderHint="high" />
          </ActionBar>
          <div aria-label="Content">
            <ActionBar.Item id="bottom" icon={<ActionsKey />} orderHint="bottom" />
            <ActionBar.Panel id="normal" icon={<ActionsKey />} />
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

  test('panel control', () => {
    const panelRef: React.MutableRefObject<HTMLDivElement | null> = { current: null }
    const outsideRef: React.MutableRefObject<HTMLButtonElement | null> = { current: null }
    const { getByLabelText } = render(
      <StyleProvider>
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
        <button ref={outsideRef}>Outside</button>
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

    userEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('aria-hidden')
    expect(checkbox).toHaveFocus()
    expect(checkbox.checked).toBe(true)

    userEvent.click(outsideRef.current as HTMLElement)
    expect(panel).toHaveAttribute('aria-hidden', 'true')
  })
})
