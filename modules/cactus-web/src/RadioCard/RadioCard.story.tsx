import React from 'react'

import { Flex, RadioCard, Span, TextInputField } from '../'
import { Action, FIELD_ARGS, Story } from '../helpers/storybook'

export default {
  title: 'RadioCard',
  component: RadioCard,
} as const

export const BasicUsage = (): React.ReactElement => {
  const ref = React.useRef({
    focus: () => document.getElementById('text')?.focus(),
  })
  return (
    <Flex role="radiogroup" aria-label="Basic Radio Cards">
      <RadioCard name="basic" flex="1 0 0" m={2}>
        Regular
      </RadioCard>
      <RadioCard name="basic" defaultChecked flex="1 0 0" m={2}>
        <RadioCard.Inverse>Above</RadioCard.Inverse>
        <Span>Checked</Span>
      </RadioCard>
      <RadioCard name="basic" flex="1 0 0" m={2} disabled>
        <Span>Disabled</Span>
        <RadioCard.Inverse>Forever</RadioCard.Inverse>
      </RadioCard>
      <RadioCard name="basic" flex="1 0 0" m={2}>
        Title
        <br />
        <Span textStyle="small">Description</Span>
        <RadioCard.Inverse>Below</RadioCard.Inverse>
      </RadioCard>
      <RadioCard name="basic" m={2} focusRef={ref}>
        <TextInputField id="text" name="inner" label="With Inner Field" placeholder="Type Here" />
      </RadioCard>
      <RadioCard defaultChecked m={2}>
        <TextInputField name="checked" label="Checked With Field" />
      </RadioCard>
      <RadioCard disabled m={2}>
        <TextInputField name="disabled" disabled defaultValue="Value" label="Disabled With Field" />
      </RadioCard>
    </Flex>
  )
}
BasicUsage.parameters = { controls: { disable: true } }

type GroupStory = Story<
  typeof RadioCard.Group,
  {
    buttonLabel: string
    onChange: Action<React.ChangeEvent<HTMLInputElement>>
  }
>
export const RadioCardGroup: GroupStory = ({ buttonLabel, onChange, ...args }) => {
  const [value, setValue] = React.useState<string>('left')
  return (
    <RadioCard.Group
      {...args}
      id="my-id"
      name="you-are-group-one"
      value={value}
      onChange={onChange.wrap(setValue, true)}
    >
      <RadioCard value="right">That's right</RadioCard>
      <RadioCard value="left">That's wrong</RadioCard>
      <RadioCard flexGrow={2} value="center">
        {buttonLabel}
      </RadioCard>
    </RadioCard.Group>
  )
}
RadioCardGroup.argTypes = {
  buttonLabel: { name: 'button label' },
  ...FIELD_ARGS,
}
RadioCardGroup.args = {
  label: 'A Label',
  disabled: false,
  tooltip: 'Here there be radio buttons',
  autoTooltip: true,
  buttonLabel: 'Supercalifragilisticexpialidocious',
}
