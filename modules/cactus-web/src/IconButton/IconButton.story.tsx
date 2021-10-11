import React, { useContext } from 'react'

import { Grid, IconButton, ScreenSizeContext, SIZES, Text } from '../'
import { actions, HIDE_CONTROL, Icon, ICON_ARG, Story, STRING } from '../helpers/storybook'

export default {
  title: 'IconButton',
  component: IconButton,
  argTypes: actions('onClick', 'onFocus', 'onBlur'),
} as const

type IBStory = Story<
  typeof IconButton,
  {
    Icon: Icon
    isTiny?: boolean
  }
>

const IconButtonBase: IBStory = ({ isTiny, Icon, ...args }) => {
  return (
    <>
      <Grid.Item tiny={isTiny ? 2 : 1}>
        <IconButton {...args} variant="standard">
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton {...args} variant="action">
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton {...args} variant="danger">
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton {...args} variant="warning">
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton {...args} variant="success">
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton {...args} variant="dark">
          <Icon />
        </IconButton>
      </Grid.Item>
    </>
  )
}

export const BasicUsage: IBStory = (args) => {
  const size = useContext(ScreenSizeContext)
  const isTiny = size === SIZES.tiny
  return (
    <Grid justify="center">
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="tiny" margin="0">
            Size
          </Text>
        </Grid.Item>
      )}
      <Grid.Item tiny={isTiny ? 2 : 1}>
        <Text textStyle="small" margin="0">
          Standard
        </Text>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Action
        </Text>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Danger
        </Text>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Warning
        </Text>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Success
        </Text>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Dark
        </Text>
      </Grid.Item>
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Tiny
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase {...args} iconSize="tiny" isTiny={isTiny} />
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Small
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase {...args} iconSize="small" isTiny={isTiny} />
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Medium
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase {...args} iconSize="medium" isTiny={isTiny} />
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Large
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase {...args} iconSize="large" isTiny={isTiny} />
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Disabled
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase {...args} iconSize="large" disabled isTiny={isTiny} />
    </Grid>
  )
}
BasicUsage.argTypes = {
  Icon: ICON_ARG,
  iconSize: HIDE_CONTROL,
  variant: HIDE_CONTROL,
  disabled: HIDE_CONTROL,
  display: HIDE_CONTROL,
}
BasicUsage.args = { label: 'icb' }

const icons = ICON_ARG.mapping
export const AllIcons: Story<typeof IconButton> = ({ label = 'icb', ...args }) => {
  return (
    <Grid justify="center">
      {Object.values(icons)
        .slice(0, Object.keys(icons).length - 2)
        .map((Icon, ix) => (
          <Grid.Item tiny={3} medium={2} large={1} key={ix}>
            <IconButton {...args} label={`${label}-${ix}`}>
              <Icon />
            </IconButton>
          </Grid.Item>
        ))}
    </Grid>
  )
}
AllIcons.argTypes = { iconSize: STRING, label: STRING }
AllIcons.args = { disabled: false }
