import { actions } from '@storybook/addon-actions'
import { array, boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import arizonaCities from '../storySupport/arizonaCities'
import FormHandler from '../storySupport/FormHandler'
import React from 'react'
import Select, { OptionType } from './Select'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

const longOptions: OptionType[] = [
  { label: 'This should be the longest option available', value: 'long-option' },
  { label: 'Here is another option', value: 'another-option' },
  { label: 'One more option', value: 'the-last-option' },
]

const defaultMultiValue = arizonaCities.slice(6, 15)

storiesOf('Select', module)
  .add('Basic Usage', () => (
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
  ))
  .add(
    'Collisions in an over-sized container',
    () => (
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
  .add('Long list of options', () => (
    <FormHandler
      defaultValue={arizonaCities[6]}
      onChange={(name, value: string | number | Array<string | number> | null) => value}
    >
      {({ value, onChange }) => (
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
  ))
  .add('Long option labels', () => (
    <FormHandler
      defaultValue=""
      onChange={(name, value: string | number | Array<string | number> | null) => value}
    >
      {({ value, onChange }) => (
        <Select
          options={longOptions}
          name="random"
          id="select-input"
          disabled={boolean('disabled', false)}
          {...eventLoggers}
          onChange={onChange}
          value={value}
        />
      )}
    </FormHandler>
  ))
  .add(
    'With Multiselect',
    () => (
      <FormHandler
        defaultValue={defaultMultiValue}
        onChange={(name, value: string | number | Array<string | number> | null) => value}
      >
        {({ value, onChange }) => (
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
    ),
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
  .add(
    'With ComboBox',
    () => (
      <FormHandler
        onChange={(name, value: string | number | Array<string | number> | null) => value}
      >
        {({ value, onChange }) => (
          <Select
            options={arizonaCities}
            name="random"
            id="select-input"
            disabled={boolean('disabled', false)}
            {...eventLoggers}
            onChange={onChange}
            value={value}
            comboBox
          />
        )}
      </FormHandler>
    ),
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
  .add(
    'With MultiSelect ComboBox',
    () => (
      <FormHandler
        onChange={(name, value: string | number | Array<string | number> | null) => value}
      >
        {({ value, onChange }) => (
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
          />
        )}
      </FormHandler>
    ),
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
