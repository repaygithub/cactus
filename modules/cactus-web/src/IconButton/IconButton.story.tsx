import * as icons from '@repay/cactus-icons'
import cactusTheme from '@repay/cactus-theme'
import { boolean, select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { useContext } from 'react'

import { Grid, IconButton, ScreenSizeContext, SIZES, StyleProvider, Text } from '../'
import actions from '../helpers/storybookActionsWorkaround'
import { IconButtonSizes, IconButtonVariants } from './IconButton'

const iconButtonVariants: IconButtonVariants[] = [
  'standard',
  'action',
  'danger',
  'warning',
  'success',
  'dark',
]

type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

export default {
  title: 'IconButton',
  component: IconButton,
} as Meta

const IconButtonBase = ({
  size,
  disabled,
  isTiny,
}: {
  size: IconButtonSizes
  disabled?: boolean
  isTiny?: boolean
}) => {
  const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
  const Icon = icons[iconName] as React.ComponentType<any>
  return (
    <>
      <Grid.Item tiny={isTiny ? 2 : 1}>
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
      <Grid.Item tiny={2}>
        <IconButton
          variant="dark"
          inverse={boolean('inverse', false)}
          iconSize={size}
          label="add"
          {...eventLoggers}
        >
          <Icon />
        </IconButton>
      </Grid.Item>
    </>
  )
}

const IconsGrid = () => {
  const size = useContext(ScreenSizeContext)
  const isTiny = size.size === SIZES.tiny.size
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
      <IconButtonBase size="tiny" isTiny={isTiny} />
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Small
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase size="small" isTiny={isTiny} />
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Medium
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase size="medium" isTiny={isTiny} />
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Large
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase size="large" isTiny={isTiny} />
      {!isTiny && (
        <Grid.Item tiny={1}>
          <Text textStyle="small" margin="0">
            Disabled
          </Text>
        </Grid.Item>
      )}
      <IconButtonBase size="large" disabled isTiny={isTiny} />
    </Grid>
  )
}

export const BasicUsage = (): React.ReactElement => {
  return (
    <StyleProvider theme={cactusTheme} global>
      <IconsGrid />
    </StyleProvider>
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
