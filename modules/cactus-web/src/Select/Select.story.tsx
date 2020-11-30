import { actions } from '@storybook/addon-actions'
import { array, boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import arizonaCities from '../storySupport/arizonaCities'
import FormHandler from '../storySupport/FormHandler'
import Select, { OptionType } from './Select'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

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
  storyshots: false,
}

export const LongListOfOptions = (): ReactElement => (
  <FormHandler
    defaultValue={arizonaCities[6]}
    onChange={(
      name,
      value: string | number | (string | number)[] | null
    ): string | number | (string | number)[] | null => value}
  >
    {({ value, onChange }): ReactElement => (
      <Select
        options={arizonaCities}
        name="random"
        id="select-input"
        disabled={boolean('disabled', false)}
        {...eventLoggers}
        onChange={onChange}
        value={value}
      />
    )}
  </FormHandler>
)

LongListOfOptions.storyName = 'Long list of options'

export const LongOptionLabels = (): ReactElement => (
  <FormHandler
    defaultValue=""
    onChange={(
      name,
      value: string | number | (string | number)[] | null
    ): string | number | (string | number)[] | null => value}
  >
    {({ value, onChange }): ReactElement => (
      <div style={{ width: '194px' }}>
        <Select
          options={longOptions}
          name="random"
          id="select-input"
          disabled={boolean('disabled', false)}
          {...eventLoggers}
          onChange={onChange}
          value={value}
        />
      </div>
    )}
  </FormHandler>
)

LongOptionLabels.storyName = 'Long option labels'

export const WithMultiselect = (): ReactElement => (
  <FormHandler
    defaultValue={defaultMultiValue}
    onChange={(
      name,
      value: string | number | (string | number)[] | null
    ): string | number | (string | number)[] | null => value}
  >
    {({ value, onChange }): ReactElement => (
      <Select
        options={arizonaCities}
        name="random"
        id="select-input"
        disabled={boolean('disabled', false)}
        {...eventLoggers}
        onChange={onChange}
        value={value}
        multiple
      />
    )}
  </FormHandler>
)

WithMultiselect.parameters = { cactus: { overrides: { overflow: 'hidden' } } }

export const WithComboBox = (): ReactElement => (
  <FormHandler
    onChange={(
      name,
      value: string | number | (string | number)[] | null
    ): string | number | (string | number)[] | null => value}
  >
    {({ value, onChange }): ReactElement => (
      <Select
        options={arizonaCities}
        name="random"
        id="select-input"
        disabled={boolean('disabled', false)}
        {...eventLoggers}
        onChange={onChange}
        value={value}
        comboBox
        canCreateOption={boolean('canCreateOption', true)}
      />
    )}
  </FormHandler>
)

WithComboBox.storyName = 'With ComboBox'
WithComboBox.parameters = { cactus: { overrides: { overflow: 'hidden' } }, storyshots: false }

export const WithMultiSelectComboBox = (): ReactElement => (
  <FormHandler
    onChange={(
      name,
      value: string | number | (string | number)[] | null
    ): string | number | (string | number)[] | null => value}
  >
    {({ value, onChange }): ReactElement => (
      <Select
        options={arizonaCities}
        name="random"
        id="select-input"
        disabled={boolean('disabled', false)}
        {...eventLoggers}
        onChange={onChange}
        value={value}
        comboBox
        multiple
        canCreateOption={boolean('canCreateOption', true)}
      />
    )}
  </FormHandler>
)

WithMultiSelectComboBox.storyName = 'With MultiSelect ComboBox'
WithMultiSelectComboBox.parameters = {
  cactus: { overrides: { overflow: 'hidden' } },
  storyshots: false,
}
