import { actions } from '@storybook/addon-actions'
import { array, boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
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
    (): ReactElement => (
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
  )
  .add(
    'Long option labels',
    (): ReactElement => (
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
  )
  .add(
    'With Multiselect',
    (): ReactElement => (
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
    ),
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
  .add(
    'With ComboBox',
    (): ReactElement => (
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
          />
        )}
      </FormHandler>
    ),
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
  .add(
    'With MultiSelect ComboBox',
    (): ReactElement => (
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
          />
        )}
      </FormHandler>
    ),
    { cactus: { overrides: { overflow: 'hidden' } } }
  )
