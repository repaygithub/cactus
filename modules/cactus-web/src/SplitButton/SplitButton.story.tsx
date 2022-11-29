import React from 'react'

import { SplitButton } from '../'
import {
  actions,
  ActionWrap,
  HIDE_CONTROL,
  Icon,
  ICON_ARG,
  Story,
  STRING,
} from '../helpers/storybook'

const icon = (name: string) => ({ ...ICON_ARG, name, defaultValue: undefined })

export default {
  title: 'SplitButton',
  component: SplitButton,
  argTypes: {
    mainActionLabel: STRING,
    MainActionIcon: icon('MainActionIcon'),
    ...actions({ name: 'onClick', wrapper: true }),
  },
  args: {
    mainActionLabel: 'Main Action',
    disabled: false,
  },
} as const

type SelectArg = {
  onClick: ActionWrap<React.MouseEvent | void>
  mainActionLabel: string
  MainActionIcon: Icon
}
type IconStory = Story<
  typeof SplitButton,
  SelectArg & {
    ActionIcon1: Icon
    ActionIcon2: Icon
  }
>

const SplitButtonBase: IconStory = ({
  ActionIcon1,
  ActionIcon2,
  onClick,
  mainActionLabel,
  MainActionIcon,
  ...args
}) => {
  return (
    <SplitButton {...args} margin="5px">
      <SplitButton.Action main onClick={onClick(mainActionLabel)}>
        {MainActionIcon && <MainActionIcon />}
        {mainActionLabel}
      </SplitButton.Action>
      <SplitButton.Action onClick={onClick('Action One')}>
        {ActionIcon1 && <ActionIcon1 />}
        Action One
      </SplitButton.Action>
      <SplitButton.Action onClick={onClick('Nope')} disabled>
        Disabled Action
      </SplitButton.Action>
      <SplitButton.Action onClick={onClick('Action Two')}>
        {ActionIcon2 && <ActionIcon2 />}
        Action Two
      </SplitButton.Action>
    </SplitButton>
  )
}
export const BasicUsage: IconStory = (args) => {
  return (
    <>
      <SplitButtonBase {...args} variant="standard" />
      <SplitButtonBase {...args} variant="danger" mainActionLabel="danger" />
      <SplitButtonBase {...args} variant="success" mainActionLabel="success" />
      <SplitButtonBase {...args} variant="standard" mainActionLabel="Disabled" disabled />
    </>
  )
}
BasicUsage.argTypes = {
  variant: HIDE_CONTROL,
  ActionIcon1: icon('actionIcon1'),
  ActionIcon2: icon('actionIcon2'),
}
BasicUsage.args = { mainActionLabel: 'standard' }

type MultiStory = Story<typeof SplitButton, SelectArg & { actions: string[] }>
export const WithCollisions: MultiStory = ({
  actions: _actions,
  onClick,
  mainActionLabel,
  MainActionIcon,
  ...args
}) => (
  <React.Fragment>
    <div style={{ position: 'absolute', left: '20px', top: '20px' }}>
      Scroll down and to the right
    </div>
    <SplitButton {...args}>
      <SplitButton.Action onClick={onClick(mainActionLabel)}>
        {MainActionIcon && <MainActionIcon />}
        {mainActionLabel}
      </SplitButton.Action>
      {_actions.map((a, i) => (
        <SplitButton.Action key={i} onClick={onClick(a)} children={a} />
      ))}
    </SplitButton>
  </React.Fragment>
)
WithCollisions.args = { actions: ['Action One', 'Action Two'] }
WithCollisions.parameters = {
  cactus: {
    overrides: {
      height: '220vh',
      width: '220vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  storyshots: false,
}

export const FixedWidthContainer: Story<typeof SplitButton, SelectArg> = ({
  onClick,
  mainActionLabel,
  MainActionIcon,
  ...args
}) => (
  <div style={{ width: '125px' }}>
    <SplitButton {...args}>
      <SplitButton.Action onClick={onClick(mainActionLabel)}>
        {MainActionIcon && <MainActionIcon />}
        {mainActionLabel}
      </SplitButton.Action>
      <SplitButton.Action onClick={onClick('Action One')}>Action One</SplitButton.Action>
      <SplitButton.Action onClick={onClick('Action Two')}>Action Two</SplitButton.Action>
    </SplitButton>
  </div>
)
