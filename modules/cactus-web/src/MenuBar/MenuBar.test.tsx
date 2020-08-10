import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import MenuBar from './MenuBar'

// @ts-ignore
global.MutationObserver = class {
  constructor() {
    return
  }
  disconnect() {
    return
  }
  observe() {
    return
  }
}

describe('component: MenuBar', () => {
  test('typechecks', () => {
    const Menu = () => {
      const navRef = React.useRef<HTMLElement>(null)
      const listRef = React.useRef<HTMLButtonElement>(null)
      const linkRef = React.useRef<HTMLAnchorElement>(null)
      const itemRef = React.useRef<HTMLButtonElement>(null)
      return (
        <MenuBar ref={navRef} aria-label="Menu of Main-ness">
          <MenuBar.List ref={listRef} title={<em>Emphasized</em>} aria-current>
            <MenuBar.Item ref={linkRef} as="a" href="#">
              Link to the Past
            </MenuBar.Item>
            <MenuBar.List title="Nested">
              <MenuBar.Item>Birdy</MenuBar.Item>
            </MenuBar.List>
          </MenuBar.List>
          <MenuBar.Item
            ref={itemRef}
            aria-current
            onClick={() => alert('Clicked')}
            children={<em>A button</em>}
          />
          <MenuBar.Item as="a">Styled Link</MenuBar.Item>
        </MenuBar>
      )
    }
    const { container } = render(
      <StyleProvider>
        <Menu />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('focus', () => {
    const { getByText } = render(
      <StyleProvider>
        <MenuBar aria-label="Menu of Main-ness">
          <MenuBar.Item>First</MenuBar.Item>
          <MenuBar.List title="Submenu">
            <MenuBar.Item>Submenu First</MenuBar.Item>
            <MenuBar.List title="Nested">
              <MenuBar.Item>Nested First</MenuBar.Item>
              <MenuBar.Item>Nested Last</MenuBar.Item>
            </MenuBar.List>
            <MenuBar.Item>Submenu Last</MenuBar.Item>
          </MenuBar.List>
          <MenuBar.Item>Last</MenuBar.Item>
        </MenuBar>
      </StyleProvider>
    )
    userEvent.tab()
    expect(getByText('First')).toHaveFocus()

    /* NOTE
     * As it stands, most of the logic in this component relies on elements
     * being "visible", and as such the logic doesn't work in tests. I'm keeping
     * this line, commented out, in case I have to change the algorithms when
     * implementing the "small" styles to support the vertical menubar.
     */
    //fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' })
    //expect(getByText('Submenu')).toHaveFocus()
  })
})
