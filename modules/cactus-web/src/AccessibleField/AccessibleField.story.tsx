import { boolean, text } from '@storybook/addon-knobs'
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
      disabled={boolean('disabled', false)}
      disableTooltip={boolean('disableTooltip', false)}
      name={text('name', 'field_name')}
      label={text('label', 'Field Label')}
      error={text('error (will show field error)', '')}
      warning={text('warning (will show field warning)', '')}
      success={text('success (will show field success)', '')}
      tooltip={text('tooltip?', 'Will only show a tooltip when text is provided.')}
      autoTooltip={boolean('autoTooltip', true)}
    >
      <input style={{ minWidth: '300px' }} />
    </AccessibleField>
  )
}
