import React from 'react'

import { List } from '../'
import { ICON_ARG, IconName, SPACE, Story } from '../helpers/storybook'

export default {
  title: 'List',
  component: List,
  parameters: { cactus: { overrides: { maxWidth: '500px' } } },
} as const

export const BasicUsage: Story<typeof List> = ({ marginLeft, ...args }) => (
  <List {...args}>
    <List.Item>Non-indented item</List.Item>
    <List.Item>
      Non-indented item with children
      <List marginLeft={marginLeft}>
        <List.Item>I am indented by 24px</List.Item>
        <List.Item>
          <List marginLeft={marginLeft}>
            <List.Item>I am indented by 48px</List.Item>
          </List>
        </List.Item>
      </List>
    </List.Item>
  </List>
)
BasicUsage.argTypes = { margin: SPACE, marginLeft: SPACE }

export const WithIcons: Story<typeof List, { iconName: IconName }> = ({ iconName, ...args }) => (
  <List {...args}>
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
WithIcons.argTypes = { iconName: { ...ICON_ARG, mapping: undefined } }
WithIcons.args = { dividers: false, iconName: 'DescriptiveFolder' }

export const HeadersAndIcons = (): React.ReactElement => (
  <List>
    <List.Item>
      <List.ItemHeader icon="DescriptiveDocument1">File 1</List.ItemHeader>
      Test File
    </List.Item>
    <List.Item>
      <List.ItemHeader icon="DescriptiveFolder">Subset of Files</List.ItemHeader>
      <List>
        <List.Item>
          <List.ItemHeader icon="DescriptiveDocument2">File 2</List.ItemHeader>
          Another Test File
        </List.Item>
        <List.Item>
          <List.ItemHeader icon="DescriptiveDocument2">File 3</List.ItemHeader>
          And Another
        </List.Item>
        <List.Item>
          <List.ItemHeader icon="DescriptiveDocument2">File 4</List.ItemHeader>
          And One More
        </List.Item>
      </List>
    </List.Item>
  </List>
)
HeadersAndIcons.parameters = { controls: { disable: true } }

export const WithDividers = (): React.ReactElement => (
  <List dividers>
    <List.Item>This is an unordered list</List.Item>
    <List.Item>This list has dividers</List.Item>
    <List.Item>Each Item is separated by a line</List.Item>
  </List>
)
WithDividers.parameters = { controls: { disable: true } }
