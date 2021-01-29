import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
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

// Example for typescript how to use a custom component with MenuBar.Item.
const Linkish = (props: { to: string; children: string }) => <a href={props.to}>{props.children}</a>

interface Sample {
  sample: string
  prop?: number
}

const WithRef = React.forwardRef<HTMLDivElement, Sample>(({ sample, prop }, ref) => (
  <div ref={ref}>
    <em>{sample}</em> {prop}
  </div>
))

class Class extends React.Component<Sample, unknown> {
  render() {
    return `${this.props.sample} ${this.props.prop}`
  }
}

const Menu = () => {
  const navRef = React.useRef<HTMLElement>(null)
  const listRef = React.useRef<HTMLSpanElement>(null)
  const linkRef = React.useRef<HTMLAnchorElement>(null)
  const itemRef = React.useRef<HTMLSpanElement>(null)
  const customRef = React.useRef<HTMLDivElement>(null)
  return (
    <MenuBar id="mb" ref={navRef} aria-label="Menu of Main-ness">
      <MenuBar.List id="em" ref={listRef} title={<em>Emphasized</em>} aria-current>
        <MenuBar.Item key="item" ref={linkRef} as="a" href="#" aria-current>
          Link to the Past
        </MenuBar.Item>
        <MenuBar.List id="nested" key="list" title="Nested">
          <MenuBar.Item key="linkish" as={Linkish} to="#">
            Birdy
          </MenuBar.Item>
          <MenuBar.Item key="normal" aria-current>
            The Mighty
          </MenuBar.Item>
          <MenuBar.Item key="custom" as={WithRef} ref={customRef} sample="Decode" />
        </MenuBar.List>
      </MenuBar.List>
      <MenuBar.Item
        ref={itemRef}
        aria-current
        onClick={() => alert('Clicked')}
        children={<em>A button</em>}
      />
      <MenuBar.Item as="a">Styled Link</MenuBar.Item>
      <MenuBar.Item as={Class} sample="class" prop={2} />
    </MenuBar>
  )
}

describe('component: MenuBar', () => {
  test('typechecks', () => {
    const { container } = render(
      <StyleProvider>
        <Menu />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('sidebar', () => {
    const { container } = render(
      <StyleProvider>
        <ScreenSizeContext.Provider value={SIZES.medium}>
          <Menu />
        </ScreenSizeContext.Provider>
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
    const hamburger = container.querySelectorAll('[role="button"]')
    expect(hamburger).toHaveLength(1)
  })

  test('sidebar collapse', () => {
    const { getByText, container } = render(
      <StyleProvider>
        <ScreenSizeContext.Provider value={SIZES.medium}>
          <Menu />
        </ScreenSizeContext.Provider>
      </StyleProvider>
    )

    const hamburger = container.querySelector('[role="button"]') as HTMLElement
    const nestedList = getByText('Emphasized').closest('span') as HTMLElement
    const nestedItem = getByText('Nested')

    expect(hamburger).toBeVisible()
    expect(nestedList).not.toBeVisible()
    expect(nestedItem).not.toBeVisible()

    userEvent.click(hamburger)
    expect(nestedList).toBeVisible()
    expect(nestedItem).not.toBeVisible()

    userEvent.click(nestedList)
    expect(nestedList).toBeVisible()
    expect(nestedItem).toBeVisible()

    userEvent.click(nestedList)
    expect(nestedList).toBeVisible()
    expect(nestedItem).not.toBeVisible()
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

  // NOTE Uncommenting this should result in 13 Typescript errors, one for each line.
  //test('bad types', () => {
  //  const Typing = () => {
  //    const ref1 = React.useRef(null)
  //    const ref2 = React.useRef(null)
  //    const ref3 = React.useRef(null)
  //    const ref6 = React.useRef(null)
  //    return (
  //      <MenuBar>
  //        <MenuBar.Item key="1" ref={ref1} value="valid" href="invalid">One</MenuBar.Item>
  //        <MenuBar.Item as="button" key="2" ref={ref2} value="valid" href="invalid">Two</MenuBar.Item>
  //        <MenuBar.Item as="a" key="3" ref={ref3} aria-current href="valid" value="invalid">Three</MenuBar.Item>
  //        {/* Doesn't accept children */}
  //        <MenuBar.Item as={WithRef} key="4" sample="hey">Four</MenuBar.Item>
  //        <MenuBar.Item as={Class} key="5" sample="jude" prop={7}>Five</MenuBar.Item>
  //        {/* Doesn't accept ref */}
  //        <MenuBar.Item as={Linkish} key="6" to="don't" ref={ref6}>Six</MenuBar.Item>
  //        {/* Unknown prop */}
  //        <MenuBar.Item as={Linkish} key="7" to="make" currently>Seven</MenuBar.Item>
  //        <MenuBar.Item as={WithRef} key="8" sample="it" prop={3} unknown />
  //        <MenuBar.Item as={Class} key="9" sample="bad" props />

  //        {/* Missing required props */}
  //        <MenuBar.Item as={Linkish} key="10" >Ten</MenuBar.Item>
  //        <MenuBar.Item as={Linkish} key="11" to="no-children" />
  //        <MenuBar.Item as={WithRef} key="12" />
  //        <MenuBar.Item as={Class} key="13" />
  //      </MenuBar>
  //    )
  //  }
  //  expect(0).toBe(1)
  //})
})
