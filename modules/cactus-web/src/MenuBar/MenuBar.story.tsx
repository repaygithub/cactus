import React from 'react'

import { MenuBar } from '../'
import { actions, ActionWrap, Story } from '../helpers/storybook'

const LABELS = [
  'Ready!',
  'And...action!',
  'Cookies',
  'Crumble',
  'There was an old lady',
  'Who swallowed a fly',
  "I don't know why",
  'She swallowed a fly',
  "Perhaps she'll die",
  'A life lived in fear is a life half-lived',
  'I should probably have more than one',
  'Menu item that is quite long',
  'But I',
  'Also need',
  'Some short ones',
  'Ein',
  'Zwei',
  'Drei',
  'Uno',
  'Dos',
  'Tres',
]

const getLabel = () => LABELS[Math.floor(Math.random() * LABELS.length)]

export default {
  title: 'MenuBar',
  component: MenuBar,
  argTypes: actions({ name: 'onClick', wrapper: true }),
} as const

type MBStory = Story<{
  breadth: number
  totalDepth: number
  onClick: ActionWrap<React.MouseEvent>
  variant?: 'light' | 'dark'
}>

export const BasicUsage: MBStory = ({ breadth, totalDepth }) => {
  const [currentActive, setCurrentActive] = React.useState(-1)
  const makeList = (
    depth: number,
    props: any,
    ix: number,
    Component: React.ComponentType<any> = MenuBar.List,
    parentIX?: number
  ) => {
    const items = []
    for (let i = 0; i < breadth; i++) {
      // We need the default to be 100% reproducible for storyshots.
      const useStatic = depth === totalDepth && i < 8
      const useList = useStatic ? i % 3 === 0 : (Math.random() * depth) / 1.5 > 0.5
      const title = useStatic ? LABELS[i] : getLabel()
      if (useList) {
        items.push(makeList(depth - 1, { title }, i, undefined, parentIX ?? i))
      } else {
        items.push(
          <MenuBar.Item
            key={i}
            aria-current={i === currentActive}
            onClick={() => {
              const menuItemIndex = parentIX ?? i
              setCurrentActive((current) => (current === menuItemIndex ? -1 : menuItemIndex))
              console.log(`x: ${i}, y: ${totalDepth - depth}`)
            }}
          >
            {title}
          </MenuBar.Item>
        )
      }
    }
    return (
      <Component key={ix} aria-current={ix === currentActive} {...props}>
        {items}
      </Component>
    )
  }

  return <>{makeList(totalDepth, {}, 0, MenuBar)}</>
}
BasicUsage.args = { breadth: 8, totalDepth: 2 }

export const MenuBarDark: MBStory = ({ breadth, totalDepth, variant }) => {
  const [currentActive, setCurrentActive] = React.useState(-1)
  const makeList = (
    depth: number,
    props: any,
    ix: number,
    Component: React.ComponentType<any> = MenuBar.List,
    parentIX?: number
  ) => {
    const items = []
    for (let i = 0; i < breadth; i++) {
      // We need the default to be 100% reproducible for storyshots.
      const useStatic = depth === totalDepth && i < 8
      const useList = useStatic ? i % 3 === 0 : (Math.random() * depth) / 1.5 > 0.5
      const title = useStatic ? LABELS[i] : getLabel()
      if (useList) {
        items.push(makeList(depth - 1, { title }, i, undefined, parentIX ?? i))
      } else {
        items.push(
          <MenuBar.Item
            key={i}
            aria-current={i === currentActive}
            onClick={() => {
              const menuItemIndex = parentIX ?? i
              setCurrentActive((current) => (current === menuItemIndex ? -1 : menuItemIndex))
              console.log(`x: ${i}, y: ${totalDepth - depth}`)
            }}
          >
            {title}
          </MenuBar.Item>
        )
      }
    }
    return (
      <Component key={ix} aria-current={ix === currentActive} variant={variant} {...props}>
        {items}
      </Component>
    )
  }

  return <>{makeList(totalDepth, {}, 0, MenuBar)}</>
}
MenuBarDark.argTypes = { variant: { options: ['light', 'dark'] } }
MenuBarDark.args = { breadth: 8, totalDepth: 2, variant: 'dark' }
