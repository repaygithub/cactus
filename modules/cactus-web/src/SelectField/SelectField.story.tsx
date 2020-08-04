import { array, boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { SelectValueType } from '../Select/Select'
import FormHandler from '../storySupport/FormHandler'
import SelectField from './SelectField'

storiesOf('SelectField', module)
  .add(
    'Basic Usage',
    (): React.ReactElement => (
      <SelectField
        label={text('label', `What's that in the sky?`)}
        name={text('name', 'ufo')}
        options={array('options', ['bird', 'plane', 'superman'])}
        disabled={boolean('disabled', false)}
        tooltip={text('tooltip', 'Select what you think you see in the sky.')}
        success={text('success', '')}
        warning={text('warning', '')}
        error={text('error', '')}
      />
    ),
    { knobs: { escapeHTML: false } }
  )
  .add(
    'Custom Styles',
    (): React.ReactElement => (
      <SelectField
        label="Who ya gonna call?"
        name="when_there_is_something_strange"
        options={['Ray Parker Jr.', 'Me maybe?', 'Ghostbusters']}
        width={text('width', '')}
        margin={text('margin', '3')}
      />
    )
  )
  .add(
    'Controlled Form',
    (): React.ReactElement => (
      <FormHandler onChange={(name: string, value: SelectValueType): SelectValueType => value}>
        {({ value, onChange }): React.ReactElement => (
          <SelectField
            label={text('label', `What's that in the sky?`)}
            name={text('name', 'ufo')}
            options={array('options', ['bird', 'plane', 'superman'])}
            disabled={boolean('disabled', false)}
            tooltip={text('tooltip', 'Select what you think you see in the sky.')}
            success={text('success', '')}
            warning={text('warning', '')}
            error={text('error', '')}
            onChange={onChange}
            value={value}
          />
        )}
      </FormHandler>
    ),
    { knobs: { escapeHTML: false } }
  )
