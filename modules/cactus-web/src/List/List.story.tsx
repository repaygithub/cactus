import * as icons from '@repay/cactus-icons'
import { select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import List from './List'

export default {
  title: 'List',
  component: List,
} as Meta

const iconNames: (keyof typeof icons)[] = Object.keys(icons) as (keyof typeof icons)[]

export const BasicUsage = (): React.ReactElement => (
  <List>
    <List.Item>Non-indented item</List.Item>
    <List.Item>
      Non-indented item with children
      <List>
        <List.Item>I am indented by 24px</List.Item>
        <List.Item>
          <List>
            <List.Item>I am indented by 48px</List.Item>
          </List>
        </List.Item>
      </List>
    </List.Item>
  </List>
)

export const WithIcons = (): React.ReactElement => {
  const iconName: keyof typeof icons = select('icon', iconNames, 'DescriptiveFolder')
  return (
    <List>
      <List.Item icon={iconName}>Non-indented item</List.Item>
      <List.Item icon={iconName}>
        Non-indented item with children
        <List>
          <List.Item icon={iconName}>I am indented by 24px</List.Item>
          <List.Item>
            <List>
              <List.Item icon={iconName}>I am indented by 48px</List.Item>
            </List>
          </List.Item>
        </List>
      </List.Item>
    </List>
  )
}

export const HeadersAndIcons = (): React.ReactElement => (
  <List>
    <List.Item header="File 1" icon="DescriptiveDocument1">
      Test File
    </List.Item>
    <List.Item header="Subset of Files" icon="DescriptiveFolder">
      <List>
        <List.Item header="File 2" icon="DescriptiveDocument2">
          Another Test File
        </List.Item>
        <List.Item header="File 3" icon="DescriptiveDocument2">
          And Another
        </List.Item>
        <List.Item header="File 4" icon="DescriptiveDocument2">
          And One More
        </List.Item>
      </List>
    </List.Item>
  </List>
)

export const WithDividers = (): React.ReactElement => (
  <List divided>
    <List.Item>This is an unordered list</List.Item>
    <List.Item>This list has dividers</List.Item>
    <List.Item>Each Item is separated by a line</List.Item>
  </List>
)
