import { actions } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import arizonaCities from '../storySupport/arizonaCities'
import FormHandler from '../storySupport/FormHandler'
import React from 'react'
import Select from './Select'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

storiesOf('Select', module)
  .add('Basic Usage', () => (
    <React.Fragment>
      <Select
        options={['name', 'other', 'three']}
        name="random"
        id="select-input"
        mb={2}
        {...eventLoggers}
      />
    </React.Fragment>
  ))
  .add(
    'Collisions in an over-sized container',
    () => (
      <React.Fragment>
        <Select
          options={['name', 'other', 'three']}
          name="random"
          id="select-input"
          mb={2}
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
    <FormHandler defaultValue={arizonaCities[6]} onChange={(name, value) => value}>
      {({ value, onChange }) => (
        <Select
          options={arizonaCities}
          name="random"
          id="select-input"
          mb={2}
          {...eventLoggers}
          onChange={onChange}
          value={value}
        />
      )}
    </FormHandler>
  ))
