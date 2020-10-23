import { array, boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
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

storiesOf('Select', module)
  .add(
    'Basic Usage',
    (): ReactElement => (
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
  )
  .add(
    'Collisions in an over-sized container',
    (): ReactElement => (
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
    ),
    { cactus: { overrides: { height: '220vh', width: '220vw' } } }
  )
  .add(
    'Long list of options',
    (): ReactElement => {
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
  )
  .add(
    'Long option labels',
    (): ReactElement => {
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
  )
  .add(
    'With Multiselect',
    (): ReactElement => {
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
    },
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
  .add(
    'With ComboBox',
    (): ReactElement => {
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
        />
      )
    },
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
  .add(
    'With MultiSelect ComboBox',
    (): ReactElement => {
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
        />
      )
    },
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
