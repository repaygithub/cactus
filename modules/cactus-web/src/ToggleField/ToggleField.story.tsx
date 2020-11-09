import { actions } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import FormHandler from '../storySupport/FormHandler'
import ToggleField from './ToggleField'

const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

export default {
  title: 'ToggleField',
  component: ToggleField,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <FormHandler defaultValue={false} onChange={(name: string, value: boolean): boolean => value}>
    {({ value, onChange }): React.ReactElement => (
      <ToggleField
        name={text('name', 'boolean_field')}
        label={text('label', 'Boolean Field')}
        value={value}
        onChange={onChange}
        disabled={boolean('disabled', false)}
        {...eventLoggers}
      />
    )}
  </FormHandler>
)
