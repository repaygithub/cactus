import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { useState } from 'react'

import { TextInputField } from '../'
import { textStyles } from '../TextInput/TextInput'

export default {
  title: 'TextInputField',
  component: TextInputField,
} as Meta

const eventLoggers = {
  onChange: (e: any) => console.log(`onChange '${e.target.name}': ${e.target.value}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

const sizeOptions = [undefined, ...textStyles]

const InputValidator = (): React.ReactElement => {
  const [input, setInput] = useState('')

  const success = input.length > 5 ? 'Your input was successful' : undefined

  return (
    <TextInputField
      name="input"
      label="Type Something"
      tooltip="You must type more than 5 characters"
      onChange={(e) => setInput(e.target.value)}
      success={success}
    />
  )
}

export const BasicUsage = (): React.ReactElement => (
  <div>
    <TextInputField
      label={text('label', 'Input Label')}
      placeholder={text('placeholder', 'Placeholder')}
      disabled={boolean('disabled', false)}
      textStyle={select('text size', sizeOptions, undefined)}
      success={text('success', '')}
      warning={text('warning', '')}
      error={text('error', '')}
      tooltip={text('tooltip', 'Enter some text')}
      name="input-1"
      autoTooltip={boolean('autoTooltip', true)}
      disableTooltip={select('disableTooltip', [false, true, undefined], false)}
      alignTooltip={select('alignTooltip', ['left', 'right'], 'right')}
      {...eventLoggers}
    />
    <TextInputField
      label="Input Label Disabled"
      placeholder="Placeholder"
      disabled
      tooltip="Enter some text"
      name="input-1"
      disableTooltip
    />
  </div>
)

export const FixedWidthContainer = (): React.ReactElement => (
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

export const Accessibility = (): React.ReactElement => <InputValidator />
