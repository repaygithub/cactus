import { DescriptiveLocation } from '@repay/cactus-icons'
import { array, boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import arizonaCities from '../storySupport/arizonaCities'
import Select, { SelectValueType } from './Select'

const eventLoggers = {
  onChange: (e: any) => console.log(`onChange '${e.target.name}': ${e.target.value}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

const defaultMultiValue = arizonaCities.slice(6, 15).reverse()

export default {
  title: 'Select',
  component: Select,
} as Meta

export const BasicUsage = (): ReactElement => {
  const optionsAvailable = boolean('Show options?', true)
  const options = array('options', ['name', 'other', 'three'])
  return (
    <React.Fragment>
      <Select
        options={optionsAvailable ? options : []}
        noOptionsText={text('No option text', 'No options available')}
        name={text('name', 'random')}
        id={text('id', 'select-input')}
        disabled={boolean('disabled', false)}
        multiple={boolean('multiple', false)}
        m={text('m', '2')}
        placeholder={text('placeHolder', 'Select an option')}
        {...eventLoggers}
      />
    </React.Fragment>
  )
}
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
  storyshots: false,
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
        name="random"
        id="select-input"
        disabled={boolean('disabled', false)}
        {...eventLoggers}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      >
        <option value="long-option">This should be the longest option available</option>
        <option value="another-option">Here is another option</option>
        <option value="the-last-option">One more option</option>
      </Select>
    </div>
  )
}

LongOptionLabels.storyName = 'Long option labels'
LongOptionLabels.parameters = { storyshots: false }
export const WithMultiselect = (): ReactElement => {
  const [value, setValue] = React.useState<SelectValueType>(defaultMultiValue)
  return (
    <Select
      name="random"
      id="select-input"
      disabled={boolean('disabled', false)}
      {...eventLoggers}
      onChange={(e) => {
        eventLoggers.onChange(e)
        setValue(e.target.value)
      }}
      value={value}
      multiple
    >
      {arizonaCities.map((city, ix) => (
        <option key={ix} value={city}>
          <DescriptiveLocation /> {city}
        </option>
      ))}
    </Select>
  )
}

WithMultiselect.parameters = { cactus: { overrides: { overflow: 'hidden' } } }

export const WithComboBox = (): ReactElement => {
  const [value, setValue] = React.useState<SelectValueType>(null)
  const optionsAvailable = boolean('Show options?', true)
  return (
    <Select
      noOptionsText={text('No option text', 'No options available')}
      name="random"
      id="select-input"
      disabled={boolean('disabled', false)}
      {...eventLoggers}
      onChange={(e) => {
        eventLoggers.onChange(e)
        setValue(e.target.value)
      }}
      value={value}
      comboBox
      canCreateOption={boolean('canCreateOption', true)}
    >
      {optionsAvailable &&
        arizonaCities.map((city, ix) => (
          <Select.Option key={ix} value={city} altText={city.toLowerCase()}>
            <DescriptiveLocation iconSize="medium" /> {city}
          </Select.Option>
        ))}
    </Select>
  )
}

WithComboBox.storyName = 'With ComboBox'
WithComboBox.parameters = { cactus: { overrides: { overflow: 'hidden' } }, storyshots: false }

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
WithMultiSelectComboBox.parameters = {
  cactus: { overrides: { overflow: 'hidden' } },
  storyshots: false,
}
