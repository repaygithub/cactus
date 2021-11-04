import React from 'react'

import { CheckBoxCard, Flex, Text, TextInputField } from '../'
import { Action, FIELD_ARGS, Story } from '../helpers/storybook'

export default {
  title: 'CheckBoxCard',
  component: CheckBoxCard,
} as const

export const BasicUsage = (): React.ReactElement => {
  const ref = React.useRef({
    focus: () => document.getElementById('text')?.focus(),
  })
  return (
    <Flex role="group" aria-label="Basic CheckBox Cards">
      <CheckBoxCard flex="1 0 0" m={2}>
        Regular
      </CheckBoxCard>
      <CheckBoxCard defaultChecked flex="1 0 0" m={2}>
        <CheckBoxCard.Inverse>Above</CheckBoxCard.Inverse>
        <Text>Checked</Text>
      </CheckBoxCard>
      <CheckBoxCard flex="1 0 0" m={2} disabled>
        <Text>Disabled</Text>
        <CheckBoxCard.Inverse>Forever</CheckBoxCard.Inverse>
      </CheckBoxCard>
      <CheckBoxCard flex="1 0 0" m={2}>
        Title
        <br />
        <Text textStyle="small">Description</Text>
        <CheckBoxCard.Inverse>Below</CheckBoxCard.Inverse>
      </CheckBoxCard>
      <CheckBoxCard m={2} focusRef={ref}>
        <TextInputField id="text" name="inner" label="With Inner Field" placeholder="Type Here" />
      </CheckBoxCard>
      <CheckBoxCard defaultChecked m={2}>
        <TextInputField name="checked" label="Checked With Field" />
      </CheckBoxCard>
      <CheckBoxCard disabled m={2}>
        <TextInputField name="disabled" disabled defaultValue="Value" label="Disabled With Field" />
      </CheckBoxCard>
    </Flex>
  )
}
BasicUsage.parameters = { controls: { disable: true } }

export const CheckBoxCardGroup: Story<
  typeof CheckBoxCard.Group,
  {
    buttonLabel: string
    onChange: Action<React.ChangeEvent<HTMLInputElement>>
  }
> = ({ buttonLabel, onChange, ...args }) => {
  const [value, setValue] = React.useState<string[]>(['left'])
  return (
    <CheckBoxCard.Group
      {...args}
      id="my-id"
      value={value}
      onChange={onChange.wrap(({ target }) =>
        setValue((old) => {
          if (target.checked) {
            return [...old, target.value]
          }
          return old.filter((x) => x !== target.value)
        })
      )}
    >
      <CheckBoxCard value="right">That's right</CheckBoxCard>
      <CheckBoxCard value="left">That's wrong</CheckBoxCard>
      <CheckBoxCard flexGrow={2} value="center">
        {buttonLabel}
      </CheckBoxCard>
    </CheckBoxCard.Group>
  )
}
CheckBoxCardGroup.argTypes = {
  ...FIELD_ARGS,
  buttonLabel: { name: 'button label' },
}
CheckBoxCardGroup.args = {
  label: 'A Label',
  name: 'you-are-group-one',
  disabled: false,
  tooltip: 'Here there be checkboxes',
  autoTooltip: true,
  buttonLabel: 'Supercalifragilisticexpialidocious',
}
