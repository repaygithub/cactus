import { number } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import MenuBar from './MenuBar'

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

function action(msg: string) {
  return () => console.log('ITEM CLICKED:', msg)
}

export default {
  title: 'MenuBar',
  component: MenuBar,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const breadth = number('Breadth', 8)
  const totalDepth = number('Depth', 2)

  const makeList = (
    depth: number,
    props: any,
    ix: number,
    Component: React.ComponentType<any> = MenuBar.List
  ) => {
    const items = []
    for (let i = 0; i < breadth; i++) {
      if ((Math.random() * depth) / 1.5 > 0.5) {
        items.push(makeList(depth - 1, { title: getLabel() }, i))
      } else {
        items.push(
          <MenuBar.Item key={i} onClick={action(`x: ${i}, y: ${totalDepth - depth}`)}>
            {getLabel()}
          </MenuBar.Item>
        )
      }
    }
    return (
      <Component key={ix} {...props}>
        {items}
      </Component>
    )
  }

  return <>{makeList(totalDepth, {}, 0, MenuBar)}</>
}
