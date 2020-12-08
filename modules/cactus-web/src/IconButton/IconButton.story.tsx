import * as icons from '@repay/cactus-icons'
import { boolean, select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Flex from '../Flex/Flex'
import Grid from '../Grid/Grid'
import actions from '../helpers/storybookActionsWorkaround'
import IconButton, { IconButtonVariants } from './IconButton'

const iconButtonVariants: IconButtonVariants[] = ['standard', 'action', 'danger']
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

export default {
  title: 'IconButton',
  component: IconButton,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName] as React.ComponentType<any>
  return (
    <Flex flexDirection="column">
      <IconButton
        variant={select('variant', iconButtonVariants, 'standard')}
        disabled={boolean('disabled', false)}
        inverse={boolean('inverse', false)}
        iconSize="tiny"
        label="add"
        {...eventLoggers}
      >
        <Icon />
      </IconButton>
      <IconButton
        variant={select('variant', iconButtonVariants, 'standard')}
        disabled={boolean('disabled', false)}
        inverse={boolean('inverse', false)}
        iconSize="small"
        label="add"
        {...eventLoggers}
      >
        <Icon />
      </IconButton>
      <IconButton
        variant={select('variant', iconButtonVariants, 'standard')}
        disabled={boolean('disabled', false)}
        inverse={boolean('inverse', false)}
        iconSize="medium"
        label="add"
        {...eventLoggers}
      >
        <Icon />
      </IconButton>
      <IconButton
        variant={select('variant', iconButtonVariants, 'standard')}
        disabled={boolean('disabled', false)}
        inverse={boolean('inverse', false)}
        iconSize="large"
        label="add"
        {...eventLoggers}
      >
        <Icon />
      </IconButton>
      <IconButton
        variant={select('variant', iconButtonVariants, 'standard')}
        disabled
        inverse={boolean('inverse', false)}
        iconSize="large"
        label="add"
        {...eventLoggers}
      >
        <Icon />
      </IconButton>
    </Flex>
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
