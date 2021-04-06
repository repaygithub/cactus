import * as icons from '@repay/cactus-icons'
import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Flex, SplitButton } from '../'
import { IconProps, SplitButtonVariant } from './SplitButton'
type IconName = keyof typeof icons | 'None'
const iconNames: IconName[] = Object.keys(icons) as IconName[]

export default {
  title: 'SplitButton',
  component: SplitButton,
} as Meta

const SplitButtonBase = ({
  variant,
  disabled,
}: {
  disabled?: boolean
  variant: SplitButtonVariant
}) => {
  iconNames.unshift('None')
  const mainIconName: IconName = select('mainActionIcon', iconNames, 'None')
  const actionIconName1: IconName = select('actionIcon1', iconNames, 'None')
  const actionIconName2: IconName = select('actionIcon2', iconNames, 'None')
  let MainIcon: React.FunctionComponent<IconProps>
  let ActionIcon1: React.FunctionComponent<IconProps> | undefined = undefined
  let ActionIcon2: React.FunctionComponent<IconProps> | undefined = undefined
  if (mainIconName !== 'None') {
    MainIcon = icons[mainIconName] as React.FunctionComponent<IconProps>
  }
  if (actionIconName1 !== 'None') {
    ActionIcon1 = icons[actionIconName1] as React.FunctionComponent<IconProps>
  }
  if (actionIconName2 !== 'None') {
    ActionIcon2 = icons[actionIconName2] as React.FunctionComponent<IconProps>
  }
  const getMainActionLabel = () => {
    if (disabled) {
      return 'Disabled'
    } else if (variant === 'standard') {
      return text('MainActionLabel', 'standard')
    } else {
      return variant
    }
  }
  return (
    <SplitButton
      disabled={disabled}
      margin="5px"
      onSelectMainAction={(): void => {
        console.log('Main Action')
      }}
      mainActionLabel={getMainActionLabel()}
      // @ts-ignore
      mainActionIcon={MainIcon ? MainIcon : undefined}
      variant={variant}
    >
      <SplitButton.Action onSelect={(): void => console.log('Action One')} icon={ActionIcon1}>
        Action One
      </SplitButton.Action>
      <SplitButton.Action onSelect={(): void => console.log('Action Two')} icon={ActionIcon2}>
        Action Two
      </SplitButton.Action>
    </SplitButton>
  )
}
export const BasicUsage = (): React.ReactElement => {
  return (
    <Flex flexWrap="wrap" justifyContent="center" alignItems="center" width="80%">
      <SplitButtonBase variant="standard" />
      <SplitButtonBase variant="danger" />
      <SplitButtonBase variant="success" />
      <SplitButtonBase variant="standard" disabled />
    </Flex>
  )
}

export const WithCollisions = (): React.ReactElement => (
  <React.Fragment>
    <div style={{ position: 'absolute', left: '20px', top: '20px' }}>
      Scroll down and to the right
    </div>
    <SplitButton
      onSelectMainAction={(): void => console.log('Main Action')}
      mainActionLabel="Main Action"
    >
      <SplitButton.Action onSelect={(): void => console.log('Action One')}>
        {text('Action Label', 'Action One')}
      </SplitButton.Action>
      <SplitButton.Action onSelect={(): void => console.log('Action Two')}>
        Action Two
      </SplitButton.Action>
    </SplitButton>
  </React.Fragment>
)

WithCollisions.parameters = {
  cactus: { overrides: { height: '220vh', width: '220vw' } },
  storyshots: false,
}

export const FixedWidthContainer = (): React.ReactElement => (
  <div style={{ width: '125px' }}>
    <SplitButton
      onSelectMainAction={(): void => console.log('Main Action')}
      mainActionLabel="Main Action"
    >
      <SplitButton.Action onSelect={(): void => console.log('Action One')}>
        Action One
      </SplitButton.Action>
      <SplitButton.Action onSelect={(): void => console.log('Action Two')}>
        Action Two
      </SplitButton.Action>
    </SplitButton>
  </div>
)
