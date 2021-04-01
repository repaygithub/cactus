import { text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { CheckBoxField } from '../'

export default {
  title: 'CheckBoxField',
  component: CheckBoxField,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <div>
    <CheckBoxField
      name={text('name', 'CheckBoxFormField')}
      id={text('id', 'checkbox-1')}
      label={text('label', 'A Label')}
    />
    <CheckBoxField name="CheckBoxFormFieldDisabled" label="Disabled" disabled />
  </div>
)

export const MultipleCheckBoxFields = (): React.ReactElement => (
  <div>
    <CheckBoxField name="CheckBoxFormField" label="Label 1" />
    <CheckBoxField name="CheckBoxFormField" label="Label 2" />
    <CheckBoxField name="CheckBoxFormField" label="Label 3" />
  </div>
)

MultipleCheckBoxFields.storyName = 'Multiple CheckBox Fields'
