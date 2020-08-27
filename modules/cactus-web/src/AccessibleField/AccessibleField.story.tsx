import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import AccessibleField from './AccessibleField'

storiesOf('AccessibleField', module).add(
  'Basic Usage',
  (): React.ReactElement => {
    const disabled = boolean('disabled', false)
    return (
      <AccessibleField
        disabled={disabled}
        name={text('name', 'field_name')}
        label={text('label', 'Field Label')}
        error={text('error (will show field error)', '')}
        warning={text('warning (will show field warning)', '')}
        success={text('success (will show field success)', '')}
        tooltip={text('tooltip?', 'Will only show a tooltip when text is provided.')}
      >
        <input style={{ minWidth: '300px' }} />
      </AccessibleField>
    )
  }
)
