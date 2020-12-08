import { actions } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import TextAreaField from './TextAreaField'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

export default {
  title: 'TextAreaField',
  component: TextAreaField,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <div>
    <TextAreaField
      label={text('label', 'Field Label')}
      name="taf-1"
      placeholder={text('placeholder', 'Placeholder')}
      disabled={boolean('disabled', false)}
      success={text('success', '')}
      warning={text('warning', '')}
      error={text('error', '')}
      tooltip={text('tooltip', 'Some tooltip text')}
      resize={boolean('resize', false)}
      autoTooltip={boolean('autoTooltip', true)}
      disableTooltip={select('disableTooltip', [false, true, undefined], false)}
      alignTooltip={select('alignTooltip', ['left', 'right'], 'right')}
      {...eventLoggers}
    />
    <TextAreaField
      label="Field Label"
      name="taf-1-diabled"
      placeholder="Placeholder"
      disabled
      tooltip="Some tooltip text"
      disableTooltip
    />
  </div>
)

export const FixedWidthContainer = (): React.ReactElement => (
  <div style={{ width: '336px' }}>
    <TextAreaField
      label={text('label', 'Field Label')}
      placeholder={text('placeholder', 'Placeholder')}
      disabled={boolean('disabled', false)}
      error={text(
        'error',
        'The input you have entered is unequivocally invalid because we absolutely do not support the information you have provided.'
      )}
      tooltip={text('tooltip', 'Enter some text')}
      name="taf-2"
      {...eventLoggers}
    />
  </div>
)
