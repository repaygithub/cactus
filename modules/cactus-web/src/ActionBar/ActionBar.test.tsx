import { ActionsGear, ActionsKey } from '@repay/cactus-icons'
import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import ActionBar from './ActionBar'
import ActionProvider from './ActionProvider'

describe('component: ActionBar', () => {
  test('typechecks', () => {
    const { container } = render(
      <StyleProvider>
        <ActionBar>
          <ActionBar.Item id="one" icon={<ActionsGear />} />
          <ActionBar.Item id="two" icon={<ActionsKey />} />
        </ActionBar>
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
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
            <ActionBar.Item id="normal" icon={<ActionsKey />} />
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
})
