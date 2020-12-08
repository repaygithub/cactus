import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import AccessibleField from './AccessibleField'

export default {
  title: 'AccessibleField',
  component: AccessibleField,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  return (
    <AccessibleField
      alignTooltip={select('alignTooltip', ['left', 'right'], 'right')}
      disableTooltip={select('disableTooltip', [false, true, undefined], false)}
      name={text('name', 'field_name')}
      label={text('label', 'Field Label')}
      tooltip={text('tooltip?', 'Will only show a tooltip when text is provided.')}
      autoTooltip={boolean('autoTooltip', true)}
    >
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
  )
}

export const DifferentVariants = (): React.ReactElement => (
  <div>
    <span>Disabled</span>
    <AccessibleField disabled label="Field Label" name="field_name">
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
    <span>Error status</span>
    <AccessibleField error="Error message" label="Field Label" name="field_name">
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
    <span>Success status</span>
    <AccessibleField success="Success message" label="Field Label" name="field_name">
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
    <span>Warning</span>
    <AccessibleField warning="Warning message" label="Field Label" name="field_name">
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
  </div>
)
