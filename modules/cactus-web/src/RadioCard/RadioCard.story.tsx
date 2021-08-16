import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Flex, RadioCard, Span, TextInputField } from '../'

export default {
  title: 'RadioCard',
  component: RadioCard,
} as Meta

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

export const RadioCardGroup = (): React.ReactElement => {
  const [value, setValue] = React.useState<string>('left')
  return (
    <RadioCard.Group
      id="my-id"
      name="you-are-group-one"
      value={value}
      label={text('label', 'A Label')}
      disabled={boolean('disabled', false)}
      onChange={(e: any) => {
        console.log(`'${e.target.name}' changed: ${e.target.value}`)
        setValue(e.target.value)
      }}
      onFocus={(e: any) => console.log(`'${e.target.value}' focused`)}
      onBlur={(e: any) => console.log(`'${e.target.value}' blurred`)}
      tooltip={text('tooltip', 'Here there be radio buttons')}
      error={text('error', '')}
      success={text('success', '')}
      warning={text('warning', '')}
      autoTooltip={boolean('autoTooltip', true)}
      disableTooltip={select('disableTooltip', [false, true, undefined], false)}
      alignTooltip={select('alignTooltip', ['left', 'right'], 'right')}
    >
      <RadioCard value="right">That's right</RadioCard>
      <RadioCard value="left">That's wrong</RadioCard>
      <RadioCard flexGrow={2} value="center">
        {text('button label', 'Supercalifragilisticexpialidocious')}
      </RadioCard>
    </RadioCard.Group>
  )
}
