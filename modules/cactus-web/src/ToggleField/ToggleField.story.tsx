import React from 'react'

import { actions } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import FormHandler from '../storySupport/FormHandler'
import ToggleField from './ToggleField'

const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

storiesOf('ToggleField', module).add('Basic Usage', () => (
  <FormHandler defaultValue={false} onChange={(name: string, value: boolean) => value}>
    {({ value, onChange }) => (
      <ToggleField
        name={text('name', 'boolean_field')}
        label={text('label', 'Boolean Field')}
        value={value}
        onChange={onChange}
        disabled={boolean('disabled', false)}
      />
    )}
  </FormHandler>
))
