import * as icons from '@repay/cactus-icons'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import SplitButton, { IconProps, SplitButtonVariant } from './SplitButton'

type IconName = keyof typeof icons | 'None'
const iconNames: IconName[] = Object.keys(icons) as IconName[]

type VariantOptions = { [k in SplitButtonVariant]: SplitButtonVariant }

const variantOptions: VariantOptions = {
  standard: 'standard',
  danger: 'danger',
  success: 'success',
}

export default {
  title: 'SplitButton',
  component: SplitButton,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  iconNames.unshift('None')
  const mainIconName: IconName = select('mainActionIcon', iconNames, 'None')
  const actionIconName1: IconName = select('actionIcon1', iconNames, 'None')
  const actionIconName2: IconName = select('actionIcon2', iconNames, 'None')
  const variant = select('variant', variantOptions, variantOptions.standard)

  let MainIcon: React.FunctionComponent<IconProps>
  let ActionIcon1: React.FunctionComponent<IconProps>
  let ActionIcon2: React.FunctionComponent<IconProps>
  if (mainIconName !== 'None') {
    MainIcon = icons[mainIconName] as React.FunctionComponent<IconProps>
  }
  if (actionIconName1 !== 'None') {
    ActionIcon1 = icons[actionIconName1] as React.FunctionComponent<IconProps>
  }
  if (actionIconName2 !== 'None') {
    ActionIcon2 = icons[actionIconName2] as React.FunctionComponent<IconProps>
  }
  return (
    <SplitButton
      onSelectMainAction={(): void => {
        console.log('Main Action')
      }}
      mainActionLabel={text('mainActionLabel', 'Main Action')}
      // @ts-ignore
      mainActionIcon={MainIcon ? MainIcon : undefined}
      disabled={boolean('disabled', false)}
      variant={variant}
    >
      <SplitButton.Action
        onSelect={(): void => console.log('Action One')}
        // @ts-ignore
        icon={ActionIcon1 && ActionIcon1}
      >
        Action One
      </SplitButton.Action>
      <SplitButton.Action
        onSelect={(): void => console.log('Action Two')}
        // @ts-ignore
        icon={ActionIcon2 && ActionIcon2}
      >
        Action Two
      </SplitButton.Action>
    </SplitButton>
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
        Action One
      </SplitButton.Action>
      <SplitButton.Action onSelect={(): void => console.log('Action Two')}>
        Action Two
      </SplitButton.Action>
    </SplitButton>
  </React.Fragment>
)

WithCollisions.parameters = { cactus: { overrides: { height: '220vh', width: '220vw' } } }

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
