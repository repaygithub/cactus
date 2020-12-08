import { actions } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import RadioButtonField from './RadioButtonField'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

export default {
  title: 'RadioButtonField',
  component: RadioButtonField,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <div>
    <RadioButtonField id="my-id" name="rbf" label={text('label', 'A Label')} {...eventLoggers} />
    <RadioButtonField
      id="my-id"
      name="rbf"
      label={text('label', 'A Label')}
      disabled
      {...eventLoggers}
    />
  </div>
)

export const MultipleRadioButtonFields = (): React.ReactElement => (
  <div>
    <RadioButtonField name="rbf" label="Label 1" {...eventLoggers} />
    <RadioButtonField name="rbf" label="Label 2" {...eventLoggers} />
    <RadioButtonField name="rbf" label="Label 3" {...eventLoggers} />
  </div>
)

MultipleRadioButtonFields.storyName = 'Multiple RadioButton Fields'
