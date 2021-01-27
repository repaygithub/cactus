import * as icons from '@repay/cactus-icons'
import { boolean, select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import actions from '../helpers/storybookActionsWorkaround'
import { Grid, Text } from '../index'
import IconButton, { IconButtonSizes, IconButtonVariants } from './IconButton'

const iconButtonVariants: IconButtonVariants[] = ['standard', 'action', 'danger', 'warning', 'success']

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

export default {
  title: 'IconButton',
  component: IconButton,
} as Meta

const IconButtonBase = ({ size, disabled }: { size: IconButtonSizes; disabled?: boolean }) => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName] as React.ComponentType<any>
  return (
    <>
      <Grid.Item tiny={2}>
        <IconButton
          variant="standard"
          inverse={boolean('inverse', false)}
          iconSize={size}
          label="add"
          disabled={disabled}
          {...eventLoggers}
        >
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton
          variant="action"
          inverse={boolean('inverse', false)}
          iconSize={size}
          label="add"
          disabled={disabled}
          {...eventLoggers}
        >
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton
          variant="danger"
          inverse={boolean('inverse', false)}
          iconSize={size}
          label="add"
          disabled={disabled}
          {...eventLoggers}
        >
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton
          variant="warning"
          inverse={boolean('inverse', false)}
          iconSize={size}
          label="add"
          disabled={disabled}
          {...eventLoggers}
        >
          <Icon />
        </IconButton>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <IconButton
          variant="success"
          inverse={boolean('inverse', false)}
          iconSize={size}
          label="add"
          disabled={disabled}
          {...eventLoggers}
        >
          <Icon />
        </IconButton>
      </Grid.Item>
    </>
  )
}
export const BasicUsage = (): React.ReactElement => {
  return (
    <Grid justify="center">
      <Grid.Item tiny={2}>
        <Text textStyle="tiny" margin="0">
          Size
        </Text>
      </Grid.Item>
      <Grid.Item tiny={2}>
        <Text textStyle="tiny" margin="0">
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
          Tiny
        </Text>
      </Grid.Item>
      <IconButtonBase size="tiny" />
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Small
        </Text>
      </Grid.Item>
      <IconButtonBase size="small" />
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Medium
        </Text>
      </Grid.Item>
      <IconButtonBase size="medium" />
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Large
        </Text>
      </Grid.Item>
      <IconButtonBase size="large" />
      <Grid.Item tiny={2}>
        <Text textStyle="small" margin="0">
          Disabled
        </Text>
      </Grid.Item>
      <IconButtonBase size="large" disabled />
    </Grid>
  )
}

export const AllIcons = (): React.ReactElement => {
  const variantSelection = select('variant', iconButtonVariants, 'standard')
  return (
    <Grid justify="center">
      {Object.values(icons)
        .slice(0, Object.keys(icons).length - 2)
        .map(
          (Icon: React.ComponentType<any>, ix): React.ReactElement => (
            <Grid.Item tiny={3} medium={2} large={1} key={ix}>
              <IconButton label={`icb-${ix}`} variant={variantSelection}>
                <Icon />
              </IconButton>
            </Grid.Item>
          )
        )}
    </Grid>
  )
}
