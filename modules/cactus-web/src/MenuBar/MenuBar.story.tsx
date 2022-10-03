import React from 'react'

import { MenuBar } from '../'
import { Story } from '../helpers/storybook'

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
} as const

type MBStory = Story<{
  breadth: number
  totalDepth: number
  variant?: 'light' | 'dark'
}>

const useMenuItems = (breadth: number, totalDepth: number) => {
  const menuItems = React.useMemo(() => {
    const getItems = (depth: number): (string | string[])[] => {
      const items = []
      for (let i = 0; i < breadth; i++) {
        // We need the default to be 100% reproducible for storyshots.
        const useStatic = depth === totalDepth && i < 8
        const useList = useStatic ? i % 3 === 0 : (Math.random() * depth) / 1.5 > 0.5
        const title = useStatic ? LABELS[i] : getLabel()
        // The first item in the list is the list title.
        items.push(useList ? [title, ...getItems(depth - 1)] : title)
      }
      return items as (string | string[])[]
    }
    return getItems(totalDepth)
  }, [breadth, totalDepth])
  return menuItems
}

export const BasicUsage: MBStory = ({ breadth, totalDepth }) => {
  const [currentActive, setCurrentActive] = React.useState(-1)
  const menuItems = useMenuItems(breadth, totalDepth)
  let parentIndex = -1
  const makeMenus =
    (parentIX?: number) =>
    (item: string | Array<string>, index: number, array: (string | string[])[]) => {
      // Top-level call, set the parent index to propagate down.
      if (array === menuItems) parentIndex = index
      const props = { key: index, 'aria-current': index === currentActive }
      if (Array.isArray(item)) {
        const [title, ...children] = item
        return (
          <MenuBar.List {...props} title={title}>
            {children.map(makeMenus(parentIndex))}
          </MenuBar.List>
        )
      } else {
        return (
          <MenuBar.Item
            {...props}
            onClick={() => {
              const nextActiveIndex = parentIX ?? index
              setCurrentActive((current) => {
                if (current === nextActiveIndex && !parentIX) {
                  return -1
                }
                return nextActiveIndex
              })
            }}
          >
            {item}
          </MenuBar.Item>
        )
      }
    }

  return <MenuBar>{menuItems.map(makeMenus())}</MenuBar>
}
BasicUsage.args = { breadth: 8, totalDepth: 2 }

export const MenuBarDark: MBStory = ({ breadth, totalDepth, variant }) => {
  const [currentActive, setCurrentActive] = React.useState(-1)
  const menuItems = useMenuItems(breadth, totalDepth)
  let parentIndex = -1
  const makeMenus =
    (parentIX?: number) =>
    (item: string | Array<string>, index: number, array: (string | string[])[]) => {
      // Top-level call, set the parent index to propagate down.
      if (array === menuItems) parentIndex = index
      const props = { key: index, 'aria-current': index === currentActive }
      if (Array.isArray(item)) {
        const [title, ...children] = item
        return (
          <MenuBar.List {...props} title={title}>
            {children.map(makeMenus(parentIndex))}
          </MenuBar.List>
        )
      } else {
        return (
          <MenuBar.Item
            {...props}
            onClick={() => {
              const nextActiveIndex = parentIX ?? index
              setCurrentActive((current) => {
                if (current === nextActiveIndex && !parentIX) {
                  return -1
                }
                return nextActiveIndex
              })
            }}
          >
            {item}
          </MenuBar.Item>
        )
      }
    }

  return <MenuBar variant={variant}>{menuItems.map(makeMenus())}</MenuBar>
}
MenuBarDark.argTypes = { variant: { options: ['light', 'dark'] } }
MenuBarDark.args = { breadth: 8, totalDepth: 2, variant: 'dark' }
