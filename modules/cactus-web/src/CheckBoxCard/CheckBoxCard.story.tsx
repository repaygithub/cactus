import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { CheckBoxCard, Flex, Span, TextInputField } from '../'

export default {
  title: 'CheckBoxCard',
  component: CheckBoxCard,
} as Meta

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
        <Span>Checked</Span>
      </CheckBoxCard>
      <CheckBoxCard flex="1 0 0" m={2} disabled>
        <Span>Disabled</Span>
        <CheckBoxCard.Inverse>Forever</CheckBoxCard.Inverse>
      </CheckBoxCard>
      <CheckBoxCard flex="1 0 0" m={2}>
        Title
        <br />
        <Span textStyle="small">Description</Span>
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

export const CheckBoxCardGroup = (): React.ReactElement => {
  const [value, setValue] = React.useState<string[]>(['left'])
  return (
    <CheckBoxCard.Group
      id="my-id"
      name="you-are-group-one"
      value={value}
      label={text('label', 'A Label')}
      disabled={boolean('disabled', false)}
      onChange={({ target }: any) => {
        console.log(`'${target.value}' changed: ${target.checked}`)
        setValue((old) => {
          if (target.checked) {
            return [...old, target.value]
          }
          return old.filter((x) => x !== target.value)
        })
      }}
      onFocus={(e: any) => console.log(`'${e.target.value}' focused`)}
      onBlur={(e: any) => console.log(`'${e.target.value}' blurred`)}
      tooltip={text('tooltip', 'Here there be checkboxes')}
      error={text('error', '')}
      success={text('success', '')}
      warning={text('warning', '')}
      autoTooltip={boolean('autoTooltip', true)}
      disableTooltip={select('disableTooltip', [false, true, undefined], false)}
      alignTooltip={select('alignTooltip', ['left', 'right'], 'right')}
    >
      <CheckBoxCard value="right">That's right</CheckBoxCard>
      <CheckBoxCard value="left">That's wrong</CheckBoxCard>
      <CheckBoxCard flexGrow={2} value="center">
        {text('button label', 'Supercalifragilisticexpialidocious')}
      </CheckBoxCard>
    </CheckBoxCard.Group>
  )
}
