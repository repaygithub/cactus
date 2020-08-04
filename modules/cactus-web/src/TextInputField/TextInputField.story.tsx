import { actions } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import TextInputField from './TextInputField'

const textInputFieldStories = storiesOf('TextInputField', module)
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

const InputValidator = (): React.ReactElement => {
  const [input, setInput] = useState('')

  let success = input.length > 5 ? 'Your input was successful' : undefined

  return (
    <TextInputField
      name="input"
      label="Type Something"
      tooltip="You must type more than 5 characters"
      onChange={(_, value): void => setInput(value)}
      success={success}
    />
  )
}

textInputFieldStories
  .add(
    'Basic Usage',
    (): React.ReactElement => (
      <TextInputField
        label={text('label', 'Input Label')}
        placeholder={text('placeholder', 'Placeholder')}
        disabled={boolean('disabled', false)}
        success={text('success', '')}
        warning={text('warning', '')}
        error={text('error', '')}
        tooltip={text('tooltip', 'Enter some text')}
        name="input-1"
        {...eventLoggers}
      />
    )
  )
  .add(
    'Fixed Width Container',
    (): React.ReactElement => (
      <div style={{ width: '235px' }}>
        <TextInputField
          label={text('label', 'Input Label')}
          placeholder={text('placeholder', 'Placeholder')}
          disabled={boolean('disabled', false)}
          error={text(
            'error',
            'The input you have entered is unequivocally invalid because we absolutely do not support the information you have provided.'
          )}
          tooltip={text('tooltip', 'Enter some text')}
          name="input-2"
          {...eventLoggers}
        />
      </div>
    )
  )
  .add('Accessibility', (): React.ReactElement => <InputValidator />)
