import React from 'react'

import { action } from '@storybook/addon-actions'
import { boolean, number, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import MenuBar from './MenuBar'

const LABELS = [
  'Ready!',
  'And..action!',
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

storiesOf('MenuBar', module).add('Basic Usage', () => {
  const breadth = number('Breadth', 8)
  const depth = number('Depth', 2)

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
          <MenuBar.Item key={i} onClick={action(`x: ${i}, y: ${depth}`)}>
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

  return makeList(depth, {}, 0, MenuBar)
})
