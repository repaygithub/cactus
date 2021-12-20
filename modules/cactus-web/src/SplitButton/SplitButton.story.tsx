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
    onSelectMainAction: HIDE_CONTROL,
    mainActionIcon: icon('mainActionIcon'),
    ...actions({ name: 'onSelect', wrapper: true }),
  },
  args: {
    mainActionLabel: 'Main Action',
    disabled: false,
  },
} as const

type SelectArg = { onSelect: ActionWrap<React.MouseEvent | void> }
type IconStory = Story<
  typeof SplitButton,
  SelectArg & {
    ActionIcon1: Icon
    ActionIcon2: Icon
  }
>

const SplitButtonBase: IconStory = ({ ActionIcon1, ActionIcon2, onSelect, ...args }) => {
  return (
    <SplitButton {...args} margin="5px" onSelectMainAction={onSelect('Main Action')}>
      <SplitButton.Action onSelect={onSelect('Action One')} icon={ActionIcon1}>
        Action One
      </SplitButton.Action>
      <SplitButton.Action onSelect={onSelect('Action Two')} icon={ActionIcon2}>
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
export const WithCollisions: MultiStory = ({ actions, onSelect, ...args }) => (
  <React.Fragment>
    <div style={{ position: 'absolute', left: '20px', top: '20px' }}>
      Scroll down and to the right
    </div>
    <SplitButton {...args} onSelectMainAction={onSelect('Main Action')}>
      {actions.map((a, i) => (
        <SplitButton.Action key={i} onSelect={onSelect(a)} children={a} />
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
  onSelect,
  ...args
}) => (
  <div style={{ width: '125px' }}>
    <SplitButton {...args} onSelectMainAction={onSelect('Main Action')}>
      <SplitButton.Action onSelect={onSelect('Action One')}>Action One</SplitButton.Action>
      <SplitButton.Action onSelect={onSelect('Action Two')}>Action Two</SplitButton.Action>
    </SplitButton>
  </div>
)
