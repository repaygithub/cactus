import { array, boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import arizonaCities from '../storySupport/arizonaCities'
import Select, { OptionType, SelectValueType } from './Select'

const eventLoggers = {
  onChange: (e: any) => console.log(`onChange '${e.target.name}': ${e.target.value}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

const longOptions: OptionType[] = [
  { label: 'This should be the longest option available', value: 'long-option' },
  { label: 'Here is another option', value: 'another-option' },
  { label: 'One more option', value: 'the-last-option' },
]

const defaultMultiValue = arizonaCities.slice(6, 15)

export default {
  title: 'Select',
  component: Select,
} as Meta

export const BasicUsage = (): ReactElement => (
  <React.Fragment>
    <Select
      options={array('options', ['name', 'other', 'three'])}
      name={text('name', 'random')}
      id={text('id', 'select-input')}
      disabled={boolean('disabled', false)}
      multiple={boolean('multiple', false)}
      m={text('m', '2')}
      {...eventLoggers}
    />
  </React.Fragment>
)

export const CollisionsInAnOverSizedContainer = (): ReactElement => (
  <React.Fragment>
    <Select
      options={array('options', ['name', 'other', 'three'])}
      name={text('name', 'random')}
      id={text('id', 'select-input')}
      disabled={boolean('disabled', false)}
      {...eventLoggers}
    />
    <div style={{ position: 'absolute', left: '20px', top: '20px' }}>
      Scroll down and to the right
    </div>
  </React.Fragment>
)

CollisionsInAnOverSizedContainer.storyName = 'Collisions in an over-sized container'
CollisionsInAnOverSizedContainer.parameters = {
  cactus: { overrides: { height: '220vh', width: '220vw' } },
}

export const LongListOfOptions = (): ReactElement => {
  const [value, setValue] = React.useState<SelectValueType>(arizonaCities[6])
  return (
    <Select
      options={arizonaCities}
      name="random"
      id="select-input"
      disabled={boolean('disabled', false)}
      {...eventLoggers}
      onChange={(e) => setValue(e.target.value)}
      value={value}
    />
  )
}

LongListOfOptions.storyName = 'Long list of options'

export const LongOptionLabels = (): ReactElement => {
  const [value, setValue] = React.useState<SelectValueType>('')
  return (
    <div style={{ width: '194px' }}>
      <Select
        options={longOptions}
        name="random"
        id="select-input"
        disabled={boolean('disabled', false)}
        {...eventLoggers}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  )
}

LongOptionLabels.storyName = 'Long option labels'

export const WithMultiselect = (): ReactElement => {
  const [value, setValue] = React.useState<SelectValueType>(defaultMultiValue)
  return (
    <Select
      options={arizonaCities}
      name="random"
      id="select-input"
      disabled={boolean('disabled', false)}
      {...eventLoggers}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      multiple
    />
  )
}

WithMultiselect.parameters = { cactus: { overrides: { overflow: 'hidden' } } }

export const WithComboBox = (): ReactElement => {
  const [value, setValue] = React.useState<SelectValueType>(null)
  return (
    <Select
      options={arizonaCities}
      name="random"
      id="select-input"
      disabled={boolean('disabled', false)}
      {...eventLoggers}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      comboBox
      canCreateOption={boolean('canCreateOption', true)}
    />
  )
}

WithComboBox.storyName = 'With ComboBox'
WithComboBox.parameters = { cactus: { overrides: { overflow: 'hidden' } } }

export const WithMultiSelectComboBox = (): ReactElement => {
  const [value, setValue] = React.useState<SelectValueType>([])
  return (
    <Select
      options={arizonaCities}
      name="random"
      id="select-input"
      disabled={boolean('disabled', false)}
      {...eventLoggers}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      comboBox
      multiple
      canCreateOption={boolean('canCreateOption', true)}
    />
  )
}

WithMultiSelectComboBox.storyName = 'With MultiSelect ComboBox'
WithMultiSelectComboBox.parameters = { cactus: { overrides: { overflow: 'hidden' } } }
